/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-unused-vars */

"use client";

// components/interview-selection.tsx

import React from "react";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dancing_Script, PT_Serif } from "next/font/google";
import { cn } from "@/lib/utils";

const dancingScript = Dancing_Script({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-dancing-script",
});

interface InterviewSelectionProps {
  onStart: (interviewType: string) => void;
}

export function InterviewSelection({ onStart }: InterviewSelectionProps) {
  const cardClasses =
    "relative w-full max-w-3xl rounded-xl border border-gray-200 shadow-lg hover:shadow-2xl transition-shadow duration-300 overflow-hidden px-8 py-6 bg-white flex items-center justify-between";
  const buttonClasses =
    "py-4 px-8 rounded-lg flex items-center justify-between font-medium hover:cursor-pointer hover:opacity-90 text-lg transition-all duration-200";

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* En-tête avec branding Michaël Aguilar */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="py-8 px-6 border-b border-gray-100"
        style={{ backgroundColor: "#0D3D60" }}
      >
        <div className="container max-w-6xl mx-auto flex flex-row items-center justify-between">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex items-center"
          >
            <img
              src="https://static.wixstatic.com/media/64ba8e_ad472222fb0249af9fdb2fda9d15eb13~mv2.png/v1/crop/x_93,y_575,w_1435,h_288/fill/w_798,h_160,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Logo%20MA%20-%20Blanc%20Transparent.png"
              alt="Logo Michaël Aguilar"
              className="h-12 w-auto"
            />
          </motion.div>
          <div className="flex items-center gap-4">
            <div className="text-white text-right">
              <p className="text-sm opacity-90">01 46 74 00 14</p>
              <p className="text-xs opacity-75">Contact</p>
            </div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="size-12 rounded-full overflow-hidden shadow-md border-2 border-white"
            >
              <img
                src="/thibaut.png"
                alt="Michaël Aguilar"
                className="object-cover w-full h-full"
              />
            </motion.div>
          </div>
        </div>
      </motion.header>

      {/* Sélection d'entretien */}
      <main className="flex-grow flex flex-col items-center justify-center p-6">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className={cn(
            "text-[3.5rem] leading-tight font-bold h-fit text-gray-800 mb-0 pb-0 text-center px-4"
          )}
        >
          Entraînement IA
        </motion.h2>

        <motion.h3
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className={cn(
            "text-[4rem] leading-tight font-bold h-fit mb-12 text-center px-4",
            dancingScript.className
          )}
          style={{ color: "#DAB475" }}
        >
          Vendeurs d'élite.
        </motion.h3>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-lg text-gray-600 mb-6 text-center max-w-2xl px-4"
        >
          Perfectionnez vos techniques de vente avec Michaël Aguilar,
          conférencier expert certifié CSP
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.7 }}
          className="w-full flex justify-center mt-8"
        >
          {/* Entretien professionnel - Card layout */}
          <div className={cardClasses}>
            {/* Left: Profile image */}
            <div className="flex items-center">
              <div className="size-20 rounded-full overflow-hidden shadow-md border-2 border-[#0D3D60]">
                <img
                  src="/thibaut.png"
                  alt="Michaël Aguilar - Expert en vente"
                  className="object-cover object-top w-full h-full"
                />
              </div>

              {/* Middle: Title and description as column */}
              <CardContent className="pl-6 pr-0 py-0">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  Simulation de Vente
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Entraînement personnalisé avec Michaël Aguilar
                  <br />
                  Les secrets des vendeurs d'élite
                </p>
              </CardContent>
            </div>

            {/* Right: Button section */}
            <div>
              <Button
                className={buttonClasses}
                style={{ backgroundColor: "#0D3D60", color: "#ffffff" }}
                onClick={() => onStart("professional")}
              >
                <span className="font-semibold text-sm">Commencer</span>
                <Icon
                  icon="ic:round-chevron-right"
                  width="24"
                  height="24"
                  className="ml-2"
                />
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Évaluation statistiques */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="flex items-center gap-8 mt-12"
        >
          <div className="flex items-center gap-2">
            <div className="flex" style={{ color: "#DAB475" }}>
              {"★★★★★".split("").map((star, i) => (
                <span key={i} className="text-lg">
                  {star}
                </span>
              ))}
            </div>
            <span className="text-gray-700 font-semibold">
              Conférences "électrochocs"
            </span>
          </div>
          <div className="text-gray-700 font-semibold">Expert certifié CSP</div>
        </motion.div>
      </main>

      {/* Pied de page */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.9 }}
        className="py-6 text-center text-gray-500 text-sm border-t border-gray-100 bg-white"
      >
        <p>Michaël Aguilar - Conférencier expert en vente et motivation</p>
        <p className="text-xs mt-1">49 Avenue Aristide Briand, 92160 Antony</p>
      </motion.footer>
    </div>
  );
}
