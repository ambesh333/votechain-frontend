"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import { BACKEND_URL } from "@/utils";
import { Chart } from "../../../components/organiserPage/BarChart";

interface EventDetails {
  id: number;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  options: Array<{
    id: number;
    eventId: number;
    option: string;
    voteCount: number;
    votedUsers: number[];
  }>;
}

const Component = () => {
  const params = useParams();
  const { id } = params;
  const [eventDetails, setEventDetails] = useState<EventDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchEventDetails = async () => {
      try {
        const response = await axios.get(
          `${BACKEND_URL}/v1/event/getEvent?eventId=${id}`,
          {
            headers: {
              Authorization: `${localStorage.getItem("token")}`,
            },
          }
        );

        setEventDetails(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching event details:", error);
        setError("Failed to load event details.");
        setLoading(false);
      }
    };

    fetchEventDetails();
  }, [id]);

  console.log(eventDetails);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="p-6">
      {eventDetails && (
        <>
          <div className="w-full max-w-4xl mx-auto py-12 md:py-16 lg:py-20">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  Posted On:{" "}
                  {new Date(eventDetails.startDate).toLocaleDateString()}
                </div>
                <div className="inline-flex items-center gap-2 bg-muted px-3 py-1 rounded-full text-xs font-medium">
                  Voting Event
                </div>
              </div>
              <h1 className="text-3xl font-bold">{eventDetails.title}</h1>
              <div className="text-muted-foreground">
                <p>{eventDetails.description}</p>
              </div>
            </div>
            <div className="my-8 border-t" />
            <div className="grid md:grid-cols-3 gap-8">
              <div className="col-span-2">
                <div className="mt-8">
                  <Chart
                    data={eventDetails.options.map((option) => ({
                      option: option.option,
                      voteCount: option.voteCount,
                    }))}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="my-8">
                  <div className="bg-[#1f2937] p-5 rounded-lg shadow-lg">
                    <h2 className="text-lg font-semibold text-white">
                      Total Voters
                    </h2>
                    <p className="mt-2 text-2xl font-bold text-blue-400">
                      {eventDetails.options.reduce((acc, option) => {
                        return acc + option.votedUsers.length;
                      }, 0)}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                  {eventDetails.options.map((option, index) => (
                    <div
                      key={index}
                      className="bg-transparent border p-4 rounded-lg shadow-md text-center"
                    >
                      <h2 className="text-md font-semibold text-white">
                        {option.option}
                      </h2>
                      <p className="mt-2 text-lg font-bold text-blue-400">
                        {option.voteCount} votes
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="my-8 border-t" />
          </div>
        </>
      )}
    </div>
  );
};

export default Component;
