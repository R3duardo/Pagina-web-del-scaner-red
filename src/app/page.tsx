"use client";

import { useState, useEffect } from "react";
import { Host } from "@/types/network";
import Header from "@/components/Header";
import ScanSection from "@/components/ScanSection";
import ErrorMessage from "@/components/ErrorMessage";
import ResultsSection from "@/components/ResultsSection";
import BackgroundEffects from "@/components/BackgroundEffects";

export default function Home() {
  const [hosts, setHosts] = useState<Host[]>([]);
  const [filteredHosts, setFilteredHosts] = useState<Host[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchHosts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch("http://localhost:3000/api/hosts");

      if (!response.ok) {
        throw new Error("Error al obtener los hosts");
      }

      const data = await response.json();
      setHosts(data.hosts || []);
      setFilteredHosts(data.hosts || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
      console.error("Error fetching hosts:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleScan = async () => {
    try {
      setScanning(true);
      setError(null);
      const response = await fetch("http://localhost:3000/api/scan", {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Error al escanear la red");
      }

      setTimeout(() => {
        fetchHosts();
        setScanning(false);
      }, 1000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
      setScanning(false);
      console.error("Error scanning:", err);
    }
  };

  useEffect(() => {
    fetchHosts();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredHosts(hosts);
    } else {
      const filtered = hosts.filter((host) =>
        host.ip_address.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredHosts(filtered);
    }
  }, [searchQuery, hosts]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-900 via-black to-neutral-900 text-white flex flex-col relative overflow-hidden">
      <BackgroundEffects />

      <main className="flex-1 w-full flex flex-col items-center justify-start px-6 py-8 relative z-10">
        <div className="w-full max-w-7xl mx-auto flex flex-col items-center space-y-12">
          <Header />
          
          <ScanSection
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onScan={handleScan}
            onRefresh={fetchHosts}
            scanning={scanning}
            loading={loading}
          />

          {error && <ErrorMessage message={error} />}

          <ResultsSection 
            hosts={filteredHosts} 
            loading={loading} 
            searchQuery={searchQuery} 
          />
        </div>
      </main>
    </div>
  );
}
