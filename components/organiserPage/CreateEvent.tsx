"use client";

import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DatePickerDemo } from "./DatePicker";
import { X } from "lucide-react";
import axios from "axios";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";
import { BACKEND_URL } from "@/utils";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";

const eventSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string(),
  startDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Invalid start date",
  }),
  endDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Invalid end date",
  }),
  options: z.array(z.string()).min(1, "At least one option is required"),
  invitedUsers: z
    .array(
      z
        .string()
        .regex(/^[1-9A-HJ-NP-Za-km-z]{32,44}$/, "Invalid Solana wallet address")
    )
    .optional(),
});

const CreateEvent = () => {
  const initialState = {
    title: "",
    description: "",
    startDate: null as Date | null,
    endDate: null as Date | null,
    options: [] as string[],
    invitedUsers: [] as string[],
  };

  const [formState, setFormState] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [shareableLink, setShareableLink] = useState<string | null>(null);
  const [newOption, setNewOption] = useState("");
  const [newAddress, setNewAddress] = useState("");

  const { title, description, startDate, endDate, options, invitedUsers } =
    formState;

  const { toast } = useToast();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof typeof formState
  ) => {
    setFormState({ ...formState, [field]: e.target.value });
  };

  const addOption = () => {
    if (newOption.trim()) {
      setFormState({ ...formState, options: [...options, newOption.trim()] });
      setNewOption("");
    }
  };

  const removeOption = (index: number) => {
    const updatedOptions = options.filter((_, i) => i !== index);
    setFormState({ ...formState, options: updatedOptions });
  };

  // Add new address to invitedUsers array
  const addAddress = () => {
    if (newAddress.trim()) {
      const solanaWalletRegex = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;
      if (solanaWalletRegex.test(newAddress.trim())) {
        setFormState({
          ...formState,
          invitedUsers: [...invitedUsers, newAddress.trim()],
        });
        setNewAddress("");
      } else {
        toast({
          title: "Invalid Wallet Address",
          description: "Please enter a valid Solana wallet address.",
          className: "border border-red-500",
          action: <ToastAction altText="Close">Close</ToastAction>,
        });
      }
    }
  };

  const removeAddress = (index: number) => {
    const updatedInvitedUsers = invitedUsers.filter((_, i) => i !== index);
    setFormState({ ...formState, invitedUsers: updatedInvitedUsers });
  };

  const handleInvitedUserChange = (index: number, value: string) => {
    const updatedInvitedUsers = invitedUsers.map((address, i) =>
      i === index ? value : address
    );
    setFormState({ ...formState, invitedUsers: updatedInvitedUsers });
  };
  const truncateAddress = (address: string) => {
    return `${address.slice(0, 4)}....${address.slice(-3)}`;
  };

  const resetForm = () => {
    setFormState(initialState);
  };

  // Submit form data
  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    try {
      const validatedData = eventSchema.parse({
        title,
        description,
        startDate: startDate ? startDate.toISOString() : "",
        endDate: endDate ? endDate.toISOString() : "",
        options,
        invitedUsers,
      });

      const response = await axios.post(
        `${BACKEND_URL}/v1/event/createEvent`,
        validatedData,
        {
          headers: {
            Authorization: `${localStorage.getItem("token")}`,
          },
        }
      );

      toast({
        title: "Event Created",
        description: `Your event was successfully created.`,
        className: "border border-green-500",
        action: <ToastAction altText="Close">Close</ToastAction>,
      });

      const uniqueLink = `http://VoteChain/vote/${uuidv4()}`;
      setShareableLink(uniqueLink);

      resetForm();
    } catch (err: any) {
      if (err instanceof z.ZodError) {
        setError(err.errors[0].message);
        toast({
          title: "Validation Error",
          description: err.errors[0].message,
          className: "border border-red-500",
          action: <ToastAction altText="Close">Close</ToastAction>,
        });
      } else {
        setError(
          err?.response?.data?.message ||
            "An error occurred while creating the event."
        );
        toast({
          title: "Submission Error",
          description:
            err?.response?.data?.message ||
            "An error occurred while creating the event.",
          className: "border border-red-500",
          action: <ToastAction altText="Close">Close</ToastAction>,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleOptionKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      addOption();
    }
  };

  const handleAddressKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      addAddress();
    }
  };

  return (
    <div className="bg-background rounded-none shadow-sm border border-input p-6 space-y-6">
      <header className="space-y-2">
        <h2 className="text-2xl font-bold">Create Event</h2>
        <p className="text-muted-foreground">
          Set up a new voting event for your community.
        </p>
      </header>

      {error && <p className="text-red-600">{error}</p>}

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Voting Question/Title</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => handleInputChange(e, "title")}
            placeholder="What should we build next?"
            className="rounded-none"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Input
            id="description"
            value={description}
            onChange={(e) => handleInputChange(e, "description")}
            placeholder="Describe your event"
            className="rounded-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="start-date">Start Date</Label>
            <DatePickerDemo
              selectedDate={startDate}
              onSelectDate={(date) =>
                setFormState({ ...formState, startDate: date })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="end-date">End Date</Label>
            <DatePickerDemo
              selectedDate={endDate}
              onSelectDate={(date) =>
                setFormState({ ...formState, endDate: date })
              }
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="options">Options</Label>
          <div className="flex items-center space-x-2">
            <Input
              id="new-option"
              value={newOption}
              onChange={(e) => setNewOption(e.target.value)}
              onKeyDown={handleOptionKeyDown}
              placeholder="Add an option"
              className="rounded-none"
            />
            <Button
              variant="outline"
              onClick={addOption}
              className="rounded-none"
            >
              Add Option
            </Button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {options.map((option, index) => (
              <div
                key={index}
                className="flex items-center space-x-1  px-2 py-1 rounded-full"
              >
                <span>{option}</span>
                <X
                  className="w-4 h-4 cursor-pointer"
                  onClick={() => removeOption(index)}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Invited Wallet Addresses Section */}
        <div className="space-y-2">
          <Label htmlFor="wallet-address">Invited Wallet Addresses</Label>
          <div className="flex items-center space-x-2">
            <Input
              id="wallet-address"
              value={newAddress}
              onChange={(e) => setNewAddress(e.target.value)}
              onKeyDown={handleAddressKeyDown} // Add this line
              placeholder="Enter Solana wallet address"
              className="rounded-none"
            />
            <Button
              variant="outline"
              onClick={addAddress}
              className="rounded-none"
            >
              Add Address
            </Button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {invitedUsers.map((address, index) => (
              <div
                key={index}
                className="flex items-center space-x-1 px-2 py-1 rounded-full"
              >
                <span>{truncateAddress(address)}</span>
                <X
                  className="w-4 h-4 cursor-pointer"
                  onClick={() => removeAddress(index)}
                />
              </div>
            ))}
          </div>
        </div>

        <div>
          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="rounded-none w-full"
          >
            {loading ? "Submitting..." : "Create Event"}
          </Button>
        </div>

        {/* {shareableLink && (
          <div className="mt-4">
            <Label htmlFor="shareable-link">Shareable Link</Label>
            <Input
              id="shareable-link"
              value={shareableLink}
              readOnly
              className="rounded-none"
            />
          </div>
        )} */}
      </div>
    </div>
  );
};

export default CreateEvent;
