import { Router, Request, Response } from "express";
import { z } from "zod";
import { authMiddleware } from "../middleware";
import { verifyAddressMiddleware } from "../middleware";
import prisma from "../db";

import { voteSchema } from "../types";

const router = Router();

interface VotingOption {
  id: number;
  eventId: number;
  option: string;
  voteCount: number;
  votedUsers: number[];
}

interface VotingEvent {
  id: number;
  title: string;
  startDate: Date;
  endDate: Date;
  description: string | null;
  invitedUsers: string[];
  creatorId: number;
  isCompleted: boolean;
  options: VotingOption;
}

// Get active votes (events that the user can vote on)
router.get(
  "/getActiveVote",
  authMiddleware,
  verifyAddressMiddleware,
  async (req: Request, res: Response) => {
    try {
      //@ts-ignore
      const userId: string = req.userId!;
      //@ts-ignore
      const address: string = req.address;

      console.log(userId, address);
      const events = await prisma.votingEvent.findMany({
        where: {
          invitedUsers: {
            has: address,
          },
          endDate: {
            gt: new Date(),
          },
        },
        include: {
          options: true,
        },
        orderBy: {
          id: "desc",
        },
      });

      return res.status(200).json(events);
    } catch (error) {
      console.error("Error fetching active votes:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }
);

// Get completed votes (events that the user has voted on or not)
router.get(
  "/getCompletedVotes",
  authMiddleware,
  verifyAddressMiddleware,
  async (req: Request, res: Response) => {
    try {
      //@ts-ignore
      const userId: string = req.userId!;
      //@ts-ignore
      const address: string = req.address;
      //@ts-ignore
      const events = await prisma.votingEvent.findMany({
        where: {
          invitedUsers: {
            has: address,
          },
          endDate: {
            lt: new Date(),
          },
        },
        include: {
          options: true,
        },
        orderBy: {
          id: "desc",
        },
      });

      const eventVotes = events.map((event: any) => {
        const hasVoted = event.options.some((option: any) =>
          option.votedUsers.includes(Number(userId))
        );

        return {
          eventId: event.id,
          title: event.title,
          description: event.description,
          options: event.options,
          hasVoted: hasVoted,
        };
      });

      return res.status(200).json(eventVotes);
    } catch (error) {
      console.error("Error fetching completed votes:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }
);

// Cast a vote
router.post(
  "/vote",
  authMiddleware,
  verifyAddressMiddleware,
  async (req: Request, res: Response) => {
    try {
      //@ts-ignore
      const userId: string = req.userId!;
      //@ts-ignore
      const address: string = req.address;

      // Validate and parse the incoming data
      const parsedData = voteSchema.parse(req.body);
      const { eventId, optionId } = parsedData;

      // Check if the event exists, is active (not completed), and the user is invited
      const event = await prisma.votingEvent.findFirst({
        where: {
          id: eventId,
          isCompleted: false,
          invitedUsers: {
            has: address, // Ensure the user is invited to vote
          },
        },
      });

      if (!event) {
        return res.status(404).json({
          message:
            "Event not found, has already been completed, or user is not invited",
        });
      }

      // Check if the user has already voted for this event
      const existingVote = await prisma.votingOption.findFirst({
        where: {
          eventId: eventId,
          votedUsers: {
            has: Number(userId),
          },
        },
      });

      if (existingVote) {
        return res.status(400).json({
          message: "User has already voted for this event",
        });
      }

      // Find the voting option that the user voted for
      const option = await prisma.votingOption.findFirst({
        where: {
          id: optionId,
          eventId: eventId,
        },
      });

      if (!option) {
        return res.status(404).json({
          message: "Voting option not found",
        });
      }

      // Increment the vote count and add the user to votedUsers for the selected option
      const updatedOption = await prisma.votingOption.update({
        where: {
          id: optionId,
        },
        data: {
          voteCount: {
            increment: 1,
          },
          votedUsers: {
            push: Number(userId),
          },
        },
      });

      return res.status(201).json({
        message: "Vote successfully cast",
        option: updatedOption,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          message: "Validation failed",
          errors: error.errors,
        });
      }

      console.error("Error casting vote:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }
);

export default router;
