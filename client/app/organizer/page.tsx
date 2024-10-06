"use client";
import { useState } from "react";
import { useWalletContext } from "@/contexts/WalletContext";
import ActiveEvent from "@/components/organiserPage/ActiveEvent";
import CreateEvent from "@/components/organiserPage/CreateEvent";
import PastEvent from "@/components/organiserPage/PastEvent";
import WalletConnectPage from "@/components/LandingPage/ConnectWalletPage";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Component() {
  const { connected } = useWalletContext();
  const [activeTab, setActiveTab] = useState("active");

  return (
    <>
      {!connected ? (
        <WalletConnectPage />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-[400px_1fr] gap-8 p-6 md:p-10">
            <CreateEvent />
            <div className="space-y-6">
              <main className="container mx-auto px-4 py-8">
                <div className="bg-[#09090B] border border-gray-800 p-6 mb-8">
                  <Tabs defaultValue="active" onValueChange={setActiveTab}>
                    <TabsList className="grid w-full grid-cols-2 bg-transparent">
                      <TabsTrigger
                        value="active"
                        className="data-[state=active]:bg-[#98ECFF] data-[state=active]:text-black text-white rounded-none"
                      >
                        Active Events
                      </TabsTrigger>
                      <TabsTrigger
                        value="past"
                        className="data-[state=active]:bg-[#98ECFF] data-[state=active]:text-black text-white rounded-none"
                      >
                        Past Events
                      </TabsTrigger>
                    </TabsList>
                    <TabsContent value="active">
                      <p className="text-muted-foreground mt-4 mb-4">
                        Events that are currently open for voting.
                      </p>
                      <ActiveEvent />
                    </TabsContent>
                    <TabsContent value="past">
                      <p className="text-muted-foreground mt-4 mb-4">
                        Events that have already concluded.
                      </p>
                      <PastEvent />
                    </TabsContent>
                  </Tabs>
                </div>
              </main>
            </div>
          </div>
        </>
      )}
    </>
  );
}
