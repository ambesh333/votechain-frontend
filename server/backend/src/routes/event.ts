import { Router, Request, Response } from "express";
import { z } from "zod";
import { authMiddleware } from "../middleware";
import prisma from "../db";
import { eventSchema } from "../types";

const router = Router();

router.post(
  "/createEvent",
  authMiddleware,
  async (req: Request, res: Response) => {
    try {
      //@ts-ignore
      const userId: string = req.userId!;

      // Validate and parse the incoming data
      const parsedData = eventSchema.parse(req.body);

      // Check if the user exists
      const user = await prisma.user.findFirst({
        where: {
          id: Number(userId),
        },
      });

      if (!user) {
        return res.status(411).json({
          message: "User not found",
        });
      }

      // Create the voting event first
      const newEvent = await prisma.votingEvent.create({
        data: {
          title: parsedData.title,
          description: parsedData.description,
          startDate: new Date(parsedData.startDate),
          endDate: new Date(parsedData.endDate),
          creatorId: Number(userId),
          invitedUsers: parsedData.invitedUsers || [],
          isCompleted: false,
        },
      });

      // Create the voting options for the event
      const optionsData = parsedData.options.map((option) => ({
        eventId: newEvent.id,
        option: option,
        voteCount: 0,
      }));

      const createdOptions = await prisma.votingOption.createMany({
        data: optionsData,
      });

      console.log("New Event and Options Created:", {
        newEvent,
        createdOptions,
      });

      // Include options in the response
      const eventWithOptions = await prisma.votingEvent.findUnique({
        where: {
          id: newEvent.id,
        },
        include: {
          options: true,
        },
      });

      return res.status(201).json(eventWithOptions);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          message: "Validation failed",
          errors: error.errors,
        });
      }

      console.error("Error creating event:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }
);

router.get("/getEvent", authMiddleware, async (req: Request, res: Response) => {
  try {
    // Extract eventId from the query parameters and userId from the middleware
    const eventId: string = req.query.eventId as string;
    //@ts-ignore
    const userId: string = req.userId as string;

    // Validate that eventId and userId are provided
    if (!eventId || !userId) {
      return res
        .status(400)
        .json({ message: "Event ID and User ID are required" });
    }

    // Check if the user exists
    const user = await prisma.user.findUnique({
      where: { id: Number(userId) },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Retrieve the event by ID and ensure it belongs to the correct user
    const eventDetails = await prisma.votingEvent.findUnique({
      where: { id: Number(eventId) },
      include: {
        options: true, // Include all related VotingOption records
      },
    });

    // Check if the event exists and is created by the authenticated user
    if (!eventDetails || eventDetails.creatorId !== Number(userId)) {
      return res
        .status(403)
        .json({ message: "Event not found or access denied" });
    }

    // Return the event details with all its voting options
    return res.status(200).json(eventDetails);
  } catch (error) {
    console.error("Error fetching event:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get(
  "/activeEvents",
  authMiddleware,
  async (req: Request, res: Response) => {
    try {
      //@ts-ignore
      const userId: string = req.userId;
      const activeEvents = await prisma.votingEvent.findMany({
        where: {
          creatorId: Number(userId),
          endDate: {
            gte: new Date(),
          },
        },
        include: {
          options: true,
        },
        orderBy: {
          id: "desc",
        },
      });

      return res.status(200).json(activeEvents);
    } catch (error) {
      console.error("Error fetching active events:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }
);

router.get(
  "/pastEvents",
  authMiddleware,
  async (req: Request, res: Response) => {
    try {
      //@ts-ignore
      const userId: string = req.userId;
      const pastEvents = await prisma.votingEvent.findMany({
        where: {
          creatorId: Number(userId),
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

      return res.status(200).json(pastEvents);
    } catch (error) {
      console.error("Error fetching past events:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }
);

export default router;
