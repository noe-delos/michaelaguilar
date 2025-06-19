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

interface InterviewSelectionProps {
  onStart: (interviewType: string) => void;
}

export function InterviewSelection({ onStart }: InterviewSelectionProps) {
  const cardClasses =
    "relative w-full max-w-3xl rounded-xl border border-gray-200 shadow-lg hover:shadow-2xl transition-shadow duration-300 overflow-hidden px-8 py-6 bg-white flex items-center justify-between";
  const buttonClasses =
    "py-4 px-8 rounded-lg flex items-center justify-between font-medium hover:cursor-pointer hover:opacity-90 text-lg transition-all duration-200";

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* En-tête avec branding Kiluz */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="py-8 px-6 border-b border-gray-100"
        style={{ backgroundColor: "#0E8DE1" }}
      >
        <div className="container max-w-6xl mx-auto flex flex-row items-center justify-between">
          <motion.img
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            src="https://kiluz.com/wp-content/uploads/2020/02/Logo-Full-Blanc-1.png"
            alt="Logo Kiluz"
            width={130}
            height={60}
            className="ml-0"
          />
          <div className="flex items-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="size-12 rounded-full overflow-hidden shadow-md absolute right-10 border-2 border-white"
            >
              <img
                src="/thibaut.png"
                alt="Avatar Thibaut"
                className="object-cover w-full h-full"
              />
            </motion.div>
          </div>
        </div>
      </motion.header>

      {/* Sélection d'entretien */}
      <main className="flex-grow flex flex-col items-center justify-center p- ">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-[3.5rem] leading-tight font-bold h-fit text-gray-800 mb-0 pb-0 text-center px-4"
        >
          Prêt à trouver le job
        </motion.h2>

        <motion.h3
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-[3.5rem] leading-tight font-bold h-fit text-[#0E8DE1] mb-12 text-center px-4"
        >
          de ses rêves ?
        </motion.h3>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-lg text-gray-600 mb-12 text-center max-w-2xl px-4"
        >
          Découvrez l'ensemble de nos accompagnements individualisés à distance
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
              <div className="size-20 rounded-full overflow-hidden shadow-md border-2 border-[#0E8DE1]">
                <img
                  src="/thibaut.png"
                  alt="Thibaut - Coach professionnel"
                  className="object-cover object-top w-full h-full"
                />
              </div>

              {/* Middle: Title and description as column */}
              <CardContent className="pl-6 pr-0 py-0">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  Entretien Professionnel
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Simulation d'entretien avec un coach professionnel
                  <br />
                  spécialisé dans le recrutement
                </p>
              </CardContent>
            </div>

            {/* Right: Button section */}
            <div>
              <Button
                className={buttonClasses}
                style={{ backgroundColor: "#0E8DE1", color: "#ffffff" }}
                onClick={() => onStart("professional")}
              >
                <span className="font-semibold text-sm">Démarrer</span>
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
            <div className="flex text-yellow-400">
              {"★★★★★".split("").map((star, i) => (
                <span key={i} className="text-lg">
                  {star}
                </span>
              ))}
            </div>
            <span className="text-gray-700 font-semibold">
              4.6/5 (250+ avis)
            </span>
          </div>
          <div className="text-gray-700 font-semibold">
            +3000 personnes formées
          </div>
        </motion.div>
      </main>

      {/* Pied de page */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.9 }}
        className="py-6 text-center text-gray-500 text-sm border-t border-gray-100 bg-white"
      >
        <p>Kiluz - Prêt à trouver le job de ses rêves ?</p>
      </motion.footer>
    </div>
  );
}
