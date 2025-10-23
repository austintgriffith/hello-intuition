"use client";

import { useState } from "react";
import type { NextPage } from "next";
import { parseEther } from "viem";
import { useAccount } from "wagmi";
import { ChatBubbleLeftRightIcon, SparklesIcon, UserGroupIcon } from "@heroicons/react/24/outline";
import { Address } from "~~/components/scaffold-eth";
import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
import { useScaffoldEventHistory } from "~~/hooks/scaffold-eth";
import { notification } from "~~/utils/scaffold-eth";

const Home: NextPage = () => {
  const { address: connectedAddress } = useAccount();
  const [newGreeting, setNewGreeting] = useState("");
  const [sendValue, setSendValue] = useState("");

  // Read current greeting
  const { data: currentGreeting } = useScaffoldReadContract({
    contractName: "YourContract",
    functionName: "greeting",
  });

  // Read total counter
  const { data: totalCounter } = useScaffoldReadContract({
    contractName: "YourContract",
    functionName: "totalCounter",
  });

  // Read user's greeting counter
  const { data: userGreetingCounter } = useScaffoldReadContract({
    contractName: "YourContract",
    functionName: "userGreetingCounter",
    args: [connectedAddress],
  });

  // Read premium status
  const { data: isPremium } = useScaffoldReadContract({
    contractName: "YourContract",
    functionName: "premium",
  });

  // Write contract hook
  const { writeContractAsync: writeYourContractAsync, isPending } = useScaffoldWriteContract({
    contractName: "YourContract",
  });

  // Get recent greeting changes
  const { data: greetingEvents, isLoading: isLoadingEvents } = useScaffoldEventHistory({
    contractName: "YourContract",
    eventName: "GreetingChange",
    watch: true,
  });

  const handleSetGreeting = async () => {
    if (!newGreeting) {
      notification.error("Please enter a greeting");
      return;
    }

    try {
      await writeYourContractAsync({
        functionName: "setGreeting",
        args: [newGreeting],
        value: sendValue ? parseEther(sendValue) : undefined,
      });
      notification.success("Greeting updated successfully!");
      setNewGreeting("");
      setSendValue("");
    } catch (error) {
      console.error("Error setting greeting:", error);
    }
  };

  return (
    <div className="flex items-center flex-col grow pt-10">
      {/* Hero Section */}
      <div className="px-5 w-full max-w-6xl">
        <div className="text-center mb-8">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-4">
            Hello Intuition
          </h1>
          <p className="text-xl text-base-content/70 mb-6">Share your thoughts on the blockchain</p>
          {connectedAddress && (
            <div className="flex justify-center items-center gap-2">
              <span className="text-sm text-base-content/60">Connected as</span>
              <Address address={connectedAddress} />
            </div>
          )}
        </div>

        {/* Current Greeting Display */}
        <div className="card bg-base-200 shadow-xl mb-8">
          <div className="card-body items-center text-center">
            <div className="flex items-center gap-2 mb-2">
              <ChatBubbleLeftRightIcon className="h-6 w-6 text-primary" />
              <h2 className="card-title text-2xl">Current Greeting</h2>
              {isPremium && (
                <div className="badge badge-secondary gap-1">
                  <SparklesIcon className="h-3 w-3" />
                  Premium
                </div>
              )}
            </div>
            <p className="text-3xl font-semibold text-primary py-4">&ldquo;{currentGreeting || "Loading..."}&rdquo;</p>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="stat bg-base-200 rounded-2xl shadow-lg">
            <div className="stat-figure text-primary">
              <UserGroupIcon className="h-8 w-8" />
            </div>
            <div className="stat-title">Total Greetings</div>
            <div className="stat-value text-primary">{totalCounter?.toString() || "0"}</div>
            <div className="stat-desc">From all users</div>
          </div>
          <div className="stat bg-base-200 rounded-2xl shadow-lg">
            <div className="stat-figure text-secondary">
              <ChatBubbleLeftRightIcon className="h-8 w-8" />
            </div>
            <div className="stat-title">Your Greetings</div>
            <div className="stat-value text-secondary">{userGreetingCounter?.toString() || "0"}</div>
            <div className="stat-desc">Your contributions</div>
          </div>
        </div>

        {/* Set Greeting Form */}
        <div className="card bg-base-100 shadow-2xl mb-8">
          <div className="card-body">
            <h2 className="card-title text-2xl mb-4 flex items-center gap-2">
              <SparklesIcon className="h-6 w-6 text-primary" />
              Set New Greeting
            </h2>
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text font-semibold">Your Greeting Message</span>
              </label>
              <input
                type="text"
                placeholder="Enter your greeting..."
                className="input input-bordered w-full input-lg"
                value={newGreeting}
                onChange={e => setNewGreeting(e.target.value)}
              />
            </div>
            <div className="form-control w-full mt-4">
              <label className="label">
                <span className="label-text font-semibold">Send ETH (optional)</span>
                <span className="label-text-alt text-base-content/60">Make it premium ✨</span>
              </label>
              <input
                type="text"
                placeholder="0.01"
                className="input input-bordered w-full"
                value={sendValue}
                onChange={e => setSendValue(e.target.value)}
              />
            </div>
            <div className="card-actions justify-end mt-6">
              <button
                className="btn btn-primary btn-lg w-full"
                onClick={handleSetGreeting}
                disabled={isPending || !connectedAddress}
              >
                {isPending ? (
                  <>
                    <span className="loading loading-spinner"></span>
                    Updating...
                  </>
                ) : (
                  <>
                    <SparklesIcon className="h-5 w-5" />
                    Update Greeting
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="card bg-base-100 shadow-xl mb-8">
          <div className="card-body">
            <h2 className="card-title text-2xl mb-4">Recent Activity</h2>
            {isLoadingEvents ? (
              <div className="flex justify-center p-8">
                <span className="loading loading-spinner loading-lg"></span>
              </div>
            ) : greetingEvents && greetingEvents.length > 0 ? (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {greetingEvents.slice(0, 10).map((event, index) => (
                  <div key={`${event.transactionHash}-${index}`} className="alert bg-base-200 shadow-sm">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Address address={event.args.greetingSetter} />
                        {event.args.premium && (
                          <div className="badge badge-secondary badge-sm gap-1">
                            <SparklesIcon className="h-3 w-3" />
                            Premium
                          </div>
                        )}
                      </div>
                      <p className="font-semibold text-lg">&ldquo;{event.args.newGreeting}&rdquo;</p>
                      {event.args.value && event.args.value > 0n && (
                        <p className="text-sm text-base-content/60 mt-1">
                          Sent: {(Number(event.args.value) / 1e18).toFixed(4)} ETH
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center p-8 text-base-content/60">
                <ChatBubbleLeftRightIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No greetings yet. Be the first!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
