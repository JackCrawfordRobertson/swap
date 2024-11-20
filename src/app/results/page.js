"use client";

import React from "react";
import ResultsUI from "@/app/components/Results/ResultsUI";
import { useResultsLogic } from "@/app/components/Results/ResultsLogic";
import CssBaseline from "@mui/material/CssBaseline";
import { ToastContainer } from "react-toastify";

export default function ResultsPage() {
  const {
    user,
    filteredVenues,
    selectedVenue,
    handleCardClick,
    handleClose,
    handleCopyEmail,
  } = useResultsLogic();

  return (
    <>
      <CssBaseline />
      <ResultsUI
        user={user}
        filteredVenues={filteredVenues}
        selectedVenue={selectedVenue}
        handleCardClick={handleCardClick}
        handleClose={handleClose}
        handleCopyEmail={handleCopyEmail}
      />
      <ToastContainer />
    </>
  );
}