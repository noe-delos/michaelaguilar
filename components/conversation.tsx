/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @next/next/no-img-element */

"use client";

// components/conversation.tsx

import { useConversation } from "@11labs/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CameraOff, ArrowLeft } from "lucide-react";
import { getQuestionsForCategory } from "@/lib/interview-questions";
import { motion, useAnimationControls, AnimatePresence } from "framer-motion";
import { Icon } from "@iconify/react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { AnimatedShinyText } from "./animated-shiny-text";
import { Dancing_Script } from "next/font/google";
import { cn } from "@/lib/utils";

const dancingScript = Dancing_Script({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-dancing-script",
});

interface ConversationProps {
  interviewType: string;
  onBack: () => void;
}

export function Conversation({ interviewType, onBack }: ConversationProps) {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [cameraEnabled, setCameraEnabled] = useState(true);
  const [conversationStarted, setConversationStarted] = useState(false);
  const [loadingSignedUrl, setLoadingSignedUrl] = useState(false);
  const [urlFetchFailed, setUrlFetchFailed] = useState(false);
  const [initializing, setInitializing] = useState(true);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout | null>(
    null
  );

  // New states for dialog and transcript functionality
  const [showSynthesisDialog, setShowSynthesisDialog] = useState(false);
  const [isGeneratingSynthesis, setIsGeneratingSynthesis] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [transcript, setTranscript] = useState<any>(null);

  useEffect(() => {
    if (!conversationStarted && !initializing) stopTimer();
  }, [conversationStarted, initializing]);

  // Animation controls for the status text
  const statusTextControls = useAnimationControls();

  const conversation = useConversation({
    onConnect: () => {
      console.log("Connected to ElevenLabs");
      setConversationStarted(true);
      setInitializing(false);
      // Start timer when conversation begins
      startTimer();
      // Store the conversation ID when connection is established
      setConversationId(conversation.getId() as string);
      console.log("Conversation ID:", conversation.getId());
    },
    onDisconnect: () => {
      console.log(
        "Disconnected from ElevenLabs conversation with id: ",
        conversation.getId()
      );
      setConversationStarted(false);
      // Stop timer when conversation ends
      stopTimer();

      // We'll handle showing the dialog in the stopConversation function now
      // This onDisconnect handler will still catch automatic disconnections
      if (elapsedTime >= 60) {
        setShowSynthesisDialog(true);
      }
    },
    onMessage: (message) => console.log("Message:", message),
    onError: (error) => {
      console.error("Error:", error);
      setUrlFetchFailed(true);
      setInitializing(false);
    },
  });

  // Format time in HH:MM:SS
  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return [hours, minutes, secs]
      .map((val) => val.toString().padStart(2, "0"))
      .join(":");
  };

  // Timer functions
  const startTimer = () => {
    if (timerInterval) {
      clearInterval(timerInterval);
    }
    setElapsedTime(0);
    const interval = setInterval(() => {
      setElapsedTime((prev) => prev + 1);
    }, 1000);
    setTimerInterval(interval);
  };

  const stopTimer = () => {
    if (timerInterval) {
      clearInterval(timerInterval);
      setTimerInterval(null);
    }
  };

  // Function to fetch the transcript from ElevenLabs API
  const getTranscript = async (conversationId: string) => {
    try {
      setIsGeneratingSynthesis(true);

      toast.loading("Récupération et analyse de votre entretien...", {
        duration: 10000,
      });

      const response = await fetch(`/api/get-transcript`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          conversationId,
          interviewType,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to get transcript: ${response.statusText}`);
      }

      const data = await response.json();

      // Store the transcript data
      setTranscript(data);

      // Log the transcript (as requested for this initial implementation)
      console.log("Transcript retrieved:", data);

      // Generate review using OpenAI
      const reviewResponse = await fetch("/api/generate-review", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          transcript: data.conversationData.transcript,
          interviewType,
        }),
      });

      if (!reviewResponse.ok) {
        throw new Error(
          `Failed to generate review: ${reviewResponse.statusText}`
        );
      }

      const reviewData = await reviewResponse.json();

      // Navigate to the results page with all the data
      router.push(
        `/results?conversationId=${conversationId}&interviewType=${interviewType}`,
        {
          state: {
            transcript: data,
            review: reviewData,
          } as any,
        } as any
      );

      toast.dismiss();
      toast.success("Analyse terminée !");

      return { transcript: data, review: reviewData };
    } catch (error) {
      console.error("Error processing transcript:", error);
      toast.dismiss();
      toast.error("Impossible de traiter la transcription de l'entretien.");
      return null;
    } finally {
      setIsGeneratingSynthesis(false);
    }
  };

  const handleGenerateSynthesis = async () => {
    if (conversationId) {
      await getTranscript(conversationId);
    }
    setShowSynthesisDialog(false);
  };

  const getSignedUrl = async (): Promise<string | null> => {
    try {
      setLoadingSignedUrl(true);
      const response = await fetch("/api/get-signed-url", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ interviewType }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Signed URL data:", data);
      return data.signedUrl;
    } catch (error) {
      console.error("Error getting signed URL:", error);
      setUrlFetchFailed(true);
      return null;
    } finally {
      setLoadingSignedUrl(false);
    }
  };

  const toggleCamera = () => {
    setCameraEnabled(!cameraEnabled);
    if (videoRef.current) {
      if (cameraEnabled) {
        const stream = videoRef.current.srcObject as MediaStream;
        if (stream) {
          stream.getTracks().forEach((track) => {
            if (track.kind === "video") {
              track.enabled = false;
            }
          });
        }
      } else {
        const stream = videoRef.current.srcObject as MediaStream;
        if (stream) {
          stream.getTracks().forEach((track) => {
            if (track.kind === "video") {
              track.enabled = true;
            }
          });
        }
      }
    }
  };

  const initializeMedia = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error("Error accessing media devices:", error);
      setCameraEnabled(false);
    }
  };

  const startConversation = async () => {
    try {
      setUrlFetchFailed(false);
      const signedUrl = await getSignedUrl();

      if (!signedUrl) {
        console.error("Failed to get signed URL");
        setUrlFetchFailed(true);
        return;
      }

      console.log("Starting conversation with signed URL:", signedUrl);
      await conversation.startSession({
        signedUrl: signedUrl,
      });
    } catch (error) {
      console.error("Error starting conversation:", error);
      setUrlFetchFailed(true);
    }
  };

  const stopConversation = async () => {
    try {
      await conversation.endSession();
      console.log("Conversation ended successfully");

      // Show synthesis dialog after stopping
      // Only if the conversation lasted more than 60 seconds
      if (elapsedTime >= 60) {
        setShowSynthesisDialog(true);
      }
    } catch (error) {
      console.error("Error ending conversation:", error);
    }
  };

  useEffect(() => {
    const initialize = async () => {
      // Initialize media devices
      await initializeMedia();

      // Show status text briefly when component mounts
      await statusTextControls.start({
        opacity: 1,
        y: 0,
        transition: { duration: 0.5 },
      });

      await statusTextControls.start({
        opacity: 0,
        y: 10,
        transition: { delay: 2, duration: 0.5 },
      });

      setInitializing(false);
    };

    initialize();

    // Cleanup function to stop video stream when component unmounts
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  // Add this effect to handle speaking status animation
  useEffect(() => {
    if (conversation.isSpeaking && conversationStarted) {
      statusTextControls.start({
        opacity: 1,
        y: 0,
        transition: { duration: 0.3 },
      });
    } else {
      statusTextControls.start({
        opacity: 0,
        y: 10,
        transition: { duration: 0.3 },
      });
    }
  }, [conversation.isSpeaking, conversationStarted, statusTextControls]);

  const getInterviewTypeLabel = () => {
    return "Simulation de Vente";
  };

  const getInterviewerName = () => {
    return "Michaël";
  };

  return (
    <div className="flex flex-col justify-between h-screen bg-white text-gray-800">
      {/* Header */}
      <div
        className="flex justify-between items-center p-6 border-b border-gray-100"
        style={{ backgroundColor: "#0D3D60" }}
      >
        <Button
          variant="outline"
          size="icon"
          onClick={onBack}
          disabled={conversationStarted && !urlFetchFailed}
          className="rounded-full border-white text-white hover:bg-white hover:text-[#0D3D60] bg-transparent"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1
          className={cn(
            "text-2xl font-bold text-center text-white",
            dancingScript.className
          )}
        >
          {getInterviewTypeLabel()}
        </h1>
        <div className="flex items-center text-white text-right text-sm">
          <div>
            <p className="opacity-90">01 46 74 00 14</p>
            <p className="text-xs opacity-75">Contact</p>
          </div>
        </div>
      </div>

      {/* Main content - perfectly centered */}
      <div className="flex-grow flex items-center justify-center">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl px-4">
          {/* Left card - Michaël Aguilar branded background */}
          <Card className="overflow-hidden h-[450px] relative bg-white border border-gray-200 shadow-lg">
            {/* Michaël Aguilar Logo positioned absolutely on top left */}
            <div className="absolute top-4 left-4 h-8">
              <img
                src="https://static.wixstatic.com/media/64ba8e_ad472222fb0249af9fdb2fda9d15eb13~mv2.png/v1/crop/x_93,y_575,w_1435,h_288/fill/w_798,h_160,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Logo%20MA%20-%20Blanc%20Transparent.png"
                alt="Logo Michaël Aguilar"
                className="h-full w-auto"
                style={{
                  filter:
                    "brightness(0) saturate(100%) invert(6%) sepia(98%) saturate(6042%) hue-rotate(208deg) brightness(99%) contrast(106%)",
                }}
              />
            </div>

            <div className="h-full w-full flex items-center justify-center p-6">
              {/* Audio visualization */}
              <div className="relative w-40 h-40 mx-auto flex items-center justify-center">
                {conversation.isSpeaking && conversationStarted ? (
                  <div className="audio-visualizer">
                    {Array.from({ length: 16 }).map((_, i) => (
                      <div
                        key={i}
                        className="audio-bar"
                        style={{
                          backgroundColor: "#0D3D60",
                          animationDelay: `${i * 0.05}s`,
                          height: `${100 - Math.abs(i - 8) * 10}%`,
                          opacity: 0.7 + Math.min(0.3, i * 0.02),
                        }}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="audio-line">
                    {Array.from({ length: 16 }).map((_, i) => (
                      <div
                        key={i}
                        className="line-segment"
                        style={{ backgroundColor: "#0D3D60" }}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Animated status text that appears at the bottom right */}
              <motion.div
                className="absolute bottom-6 right-6 flex items-center"
                initial={{ opacity: 0, y: 10 }}
                animate={statusTextControls}
              >
                <div className="relative w-8 h-8 mr-2 rounded-full overflow-hidden border border-[#0D3D60]">
                  <img
                    src="/thibaut.png"
                    alt={getInterviewerName()}
                    className="w-full h-full object-cover object-top"
                  />
                </div>
                <AnimatedShinyText style={{ color: "#0D3D60" }}>
                  {getInterviewerName()} est en train de parler...
                </AnimatedShinyText>
              </motion.div>
            </div>
          </Card>

          {/* Right - Camera feed with clean white container */}
          <div className="h-[450px] bg-white border border-gray-200 rounded-xl flex items-center justify-center shadow-lg">
            {cameraEnabled ? (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="h-full w-full object-cover object-top rounded-xl transform scale-x-[-1]"
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center bg-gray-50 rounded-xl">
                <div className="text-center">
                  <CameraOff className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                  <p className="text-gray-500">La caméra est désactivée</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom controls */}
      <div className="p-6 bg-white border-t border-gray-100">
        {/* Timer */}
        <div
          className="text-center text-xl font-mono mb-4 font-semibold"
          style={{ color: "#0D3D60" }}
        >
          {formatTime(elapsedTime)}
        </div>

        <div className="flex justify-center items-center gap-6 mb-4">
          <Button
            variant="outline"
            size="icon"
            onClick={toggleCamera}
            className="rounded-full h-14 w-14 shadow-md hover:cursor-pointer border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
          >
            {cameraEnabled ? (
              <Icon icon="bxs:camera-off" className="size-5" />
            ) : (
              <Icon icon="tabler:camera-filled" className="size-5" />
            )}
          </Button>

          {urlFetchFailed ? (
            <Button
              className="rounded-full h-14 w-14 shadow-md hover:cursor-pointer text-white"
              size="icon"
              onClick={startConversation}
              style={{ backgroundColor: "#0D3D60" }}
            >
              <Icon icon="solar:play-bold" className="h-6 w-6" />
            </Button>
          ) : (
            <Button
              className="rounded-full h-14 w-14 shadow-md hover:cursor-pointer text-white"
              size="icon"
              disabled={conversationStarted || loadingSignedUrl}
              onClick={startConversation}
              style={{ backgroundColor: "#0D3D60" }}
            >
              {initializing || loadingSignedUrl ? (
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
              ) : (
                <Icon icon="solar:play-bold" className="h-6 w-6" />
              )}
            </Button>
          )}

          <Button
            variant="destructive"
            size="icon"
            disabled={!conversationStarted}
            onClick={stopConversation}
            className="rounded-full h-14 w-14 shadow-md hover:cursor-pointer"
          >
            <Icon icon="solar:stop-bold" className="h-6 w-6" />
          </Button>
        </div>

        <div className="text-center text-sm text-gray-500">
          <p>
            Statut:{" "}
            {conversationStarted
              ? "Connecté"
              : initializing
              ? "Initialisation..."
              : "Déconnecté"}
          </p>
          {conversationStarted && (
            <p>
              Michaël est en train de{" "}
              {conversation.isSpeaking ? "parler" : "écouter"}
            </p>
          )}
        </div>
      </div>

      {/* Enhanced Synthesis Dialog */}
      <Dialog open={showSynthesisDialog} onOpenChange={setShowSynthesisDialog}>
        <DialogContent className="sm:max-w-lg max-h-[80vh] overflow-y-auto bg-white border border-gray-200 text-gray-800">
          <DialogHeader className="text-center">
            <DialogTitle
              className="text-2xl font-bold"
              style={{ color: "#0D3D60" }}
            >
              Votre simulation est terminée !
            </DialogTitle>
          </DialogHeader>

          <div className="flex flex-col items-center py-6">
            {/* Interview Type Image */}
            <div
              className="relative w-32 h-32 rounded-full overflow-hidden mb-6 border-4 shadow-lg bg-white"
              style={{ borderColor: "#0D3D60" }}
            >
              <Image
                src="/thibaut.png"
                alt="Michaël Aguilar"
                layout="fill"
                objectFit="cover"
                className="object-top"
              />
            </div>

            <p className="text-xl mb-4 text-center text-gray-800">
              Souhaitez-vous obtenir une analyse détaillée de votre performance
              de vente ?
            </p>

            <p className="text-gray-600 text-center mb-6">
              Michaël Aguilar va analyser votre simulation et vous proposer un
              bilan complet avec ses conseils d'expert en vente.
            </p>
          </div>

          <DialogFooter className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              variant="outline"
              onClick={() => setShowSynthesisDialog(false)}
              className="w-full sm:w-auto text-base py-6 border-gray-200 text-gray-700 hover:bg-gray-50"
            >
              Non merci
            </Button>
            <Button
              onClick={handleGenerateSynthesis}
              style={{ backgroundColor: "#0D3D60" }}
              disabled={isGeneratingSynthesis}
              className="w-full sm:w-auto text-base py-6 text-white"
            >
              {isGeneratingSynthesis ? (
                <>
                  <div className="animate-spin mr-2 h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                  Génération en cours...
                </>
              ) : (
                "C'est parti !"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* CSS for audio visualization */}
      <style jsx global>{`
        /* Audio wave visualizer (when speaking) */
        .audio-visualizer {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 3px;
          width: 100%;
          height: 100%;
        }

        .audio-bar {
          width: 4px;
          border-radius: 2px;
          animation: audio-wave 0.8s infinite ease-in-out;
        }

        @keyframes audio-wave {
          0%,
          100% {
            transform: scaleY(0.3);
          }
          50% {
            transform: scaleY(1);
          }
        }

        /* Horizontal line (when not speaking) */
        .audio-line {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          gap: 3px;
        }

        .line-segment {
          width: 4px;
          height: 2px;
          border-radius: 4px;
        }
      `}</style>
    </div>
  );
}
