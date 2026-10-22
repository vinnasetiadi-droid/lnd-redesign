/**
 * Wave AI Assistant - Main Component
 * Integrates Wave Animation + DialogNisa
 * Position: Fixed at bottom center of screen
 */

import { useState, useEffect } from "react";
import { WaveAnimation } from "./WaveAnimation";
import DialogNisa from "../dialog/DialogNisa";
import { assistantData } from "../dialog/data";
import { useAuthStore } from "../../../store/useAuthStore";
import type { UserRole } from "../dialog/data";
import { cn } from "../../../lib/utils";

interface WaveAssistantProps {
  position?: "top" | "bottom";
}

export function WaveAssistant({ position = "bottom" }: WaveAssistantProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { user } = useAuthStore();
  
  // Map user role to assistant role
  const getUserRole = (): UserRole => {
    if (!user?.role) return "peserta";
    
    const roleMap: Record<string, UserRole> = {
      ld_team: "admin",
      trainee: "peserta",
      hr: "pimpinan",
      trainer: "instruktur",
    };
    
    return roleMap[user.role] || "peserta";
  };

  const userRole = getUserRole();
  const content = assistantData[userRole];

  const handleWaveClick = () => {
    console.log("🌊 Wave clicked - Opening DialogNisa");
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    console.log("❌ Closing DialogNisa");
    setIsDialogOpen(false);
  };

  return (
    <>
      {/* Wave Animation Container - Fixed at bottom center */}
      <div
        className={cn(
          "fixed left-1/2 -translate-x-1/2 z-[90] pointer-events-auto",
          position === "bottom" ? "bottom-0" : "top-0"
        )}
      >
        <div onClick={handleWaveClick} className="cursor-pointer">
          <WaveAnimation role={userRole} position={position} />
        </div>
      </div>

      {/* DialogNisa - Complete dialog with socket integration */}
      <DialogNisa 
        isOpen={isDialogOpen} 
        onClose={handleCloseDialog}
        content={content}
      />
    </>
  );
}