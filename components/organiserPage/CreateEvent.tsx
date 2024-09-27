"use client";

import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DatePickerDemo } from "./DatePicker";
import { TabsDemo } from "./Tab";
import axios from "axios";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";
import { BACKEND_URL } from "@/utils";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";

// Define validation schema using Zod
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
  invitedUsers: z.array(z.string()).optional(),
});

const CreateEvent = () => {
  const initialState = {
    title: "",
    description: "",
    startDate: null as Date | null,
    endDate: null as Date | null,
    options: [""],
    invitedUsers: [] as string[],
  };
  const [formState, setFormState] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [shareableLink, setShareableLink] = useState<string | null>(null);

  const { title, description, startDate, endDate, options, invitedUsers } =
    formState;

  const { toast } = useToast();

  // Handle input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof typeof formState
  ) => {
    setFormState({ ...formState, [field]: e.target.value });
  };

  const handleOptionChange = (index: number, value: string) => {
    const updatedOptions = options.map((option, i) =>
      i === index ? value : option
    );
    setFormState({ ...formState, options: updatedOptions });
  };

  const addOption = () => {
    setFormState({ ...formState, options: [...options, ""] });
  };

  const removeOption = (index: number) => {
    const updatedOptions = options.filter((_, i) => i !== index);
    setFormState({ ...formState, options: updatedOptions });
  };

  const addAddress = () => {
    setFormState({ ...formState, invitedUsers: [...invitedUsers, ""] });
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

  const resetForm = () => {
    setFormState(initialState);
  };

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

      console.log("Event created:", response.data);
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

  console.log(formState);

  return (
    <div className="bg-background rounded-lg shadow-sm border border-input p-6 space-y-6">
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
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="title">Description</Label>
          <Input
            id="title"
            value={description}
            onChange={(e) => handleInputChange(e, "description")}
            placeholder="Describe your title"
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
          {options.map((option, index) => (
            <div key={index} className="flex items-center space-x-2">
              <Input
                id={`option-${index}`}
                value={option}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                placeholder={`Option ${index + 1}`}
              />
              {index > 0 && (
                <Button
                  variant="destructive"
                  onClick={() => removeOption(index)}
                >
                  Remove
                </Button>
              )}
            </div>
          ))}
          <Button variant="outline" onClick={addOption}>
            Add Option
          </Button>
        </div>

        <TabsDemo
          invitedUsers={invitedUsers}
          addAdress={addAddress}
          removeAddress={removeAddress}
          handleinvitedUserChange={handleInvitedUserChange}
          shareableLink={shareableLink}
        />

        <Button className="w-full" onClick={handleSubmit} disabled={loading}>
          {loading ? "Creating..." : "Create Event"}
        </Button>
      </div>
    </div>
  );
};

export default CreateEvent;

// 'use client'

// import { useState } from 'react'
// import { XIcon, PlusCircleIcon } from 'lucide-react'
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Textarea } from "@/components/ui/textarea"

// export function CreateEventForm() {
//   const [isDialogOpen, setIsDialogOpen] = useState(false)
//   const [eventImage, setEventImage] = useState('/placeholder.svg?height=100&width=100')

//   const openDialog = () => setIsDialogOpen(true)
//   const closeDialog = () => setIsDialogOpen(false)

//   return (
//     <>
//       <button
//         onClick={openDialog}
//         className="bg-[#98ECFF] text-black font-semibold py-2 px-4 hover:bg-[#7DCEE0] transition-colors"
//       >
//         Create Event
//       </button>

//       {isDialogOpen && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-[#09090B] border border-[#98ECFF] p-6 max-w-md w-full relative">
//             <button
//               className="absolute top-2 right-2 text-gray-400 hover:text-white"
//               onClick={closeDialog}
//             >
//               <XIcon className="w-6 h-6" />
//             </button>

//             <div className="flex items-center justify-center mb-6">
//               <div className="relative">
//                 <img
//                   src={eventImage}
//                   alt="Event"
//                   className="w-24 h-24 rounded-full object-cover"
//                 />
//                 <button
//                   className="absolute bottom-0 right-0 bg-[#98ECFF] rounded-full p-1"
//                   onClick={() => {/* TODO: Implement image upload */}}
//                 >
//                   <PlusCircleIcon className="w-6 h-6 text-black" />
//                 </button>
//               </div>
//             </div>

//             <form className="space-y-4">
//               <div>
//                 <Label htmlFor="eventTitle">Event Title</Label>
//                 <Input id="eventTitle" placeholder="Enter event title" className="bg-gray-800 border-gray-700 text-white" />
//               </div>

//               <div>
//                 <Label htmlFor="eventDescription">Description</Label>
//                 <Textarea id="eventDescription" placeholder="Enter event description" className="bg-gray-800 border-gray-700 text-white" />
//               </div>

//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <Label htmlFor="startDate">Start Date</Label>
//                   <Input id="startDate" type="date" className="bg-gray-800 border-gray-700 text-white" />
//                 </div>
//                 <div>
//                   <Label htmlFor="endDate">End Date</Label>
//                   <Input id="endDate" type="date" className="bg-gray-800 border-gray-700 text-white" />
//                 </div>
//               </div>

//               <div>
//                 <Label htmlFor="invitedWallets">Invited Wallets</Label>
//                 <Input id="invitedWallets" placeholder="Enter wallet addresses" className="bg-gray-800 border-gray-700 text-white" />
//               </div>

//               <div>
//                 <Label htmlFor="votingOptions">Voting Options</Label>
//                 <Textarea id="votingOptions" placeholder="Enter voting options (one per line)" className="bg-gray-800 border-gray-700 text-white" />
//               </div>

//               <div className="flex justify-end space-x-4">
//                 <button
//                   type="button"
//                   onClick={closeDialog}
//                   className="px-4 py-2 border border-gray-600 text-gray-300 hover:bg-gray-700 transition-colors"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   className="px-4 py-2 bg-[#98ECFF] text-black font-semibold hover:bg-[#7DCEE0] transition-colors"
//                 >
//                   Create Event
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </>
//   )
// }
