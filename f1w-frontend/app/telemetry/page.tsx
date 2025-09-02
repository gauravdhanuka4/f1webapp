"use client";

import React, { useState, useEffect } from 'react';
import PageHeader from '../components/PageHeader';
import Card from '../components/Card';
import Button from '../components/Button';
import Chart from '../components/charts/Chart';

const TelemetryPage = () => {
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [races, setRaces] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [race, setRace] = useState('');
  const [session, setSession] = useState('');
  const [driver1, setDriver1] = useState('');
  const [driver2, setDriver2] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isPickerLoading, setIsPickerLoading] = useState({ races: false, sessions: false, drivers: false });
  const [speedTraceData, setSpeedTraceData] = useState(null);
  const [gearShiftsData, setGearShiftsData] = useState(null);
  const [trackDominanceData, setTrackDominanceData] = useState(null);

  // Fetch races when year changes
  useEffect(() => {
    if (!year) return;
    const fetchRaces = async () => {
      setIsPickerLoading(prev => ({ ...prev, races: true }));
      try {
        const scheduleRes = await fetch(`/api/info/schedule?year=${year}`);
        const scheduleData = await scheduleRes.json();
        if (scheduleData.success) {
          setRaces(scheduleData.data.races);
          if (scheduleData.data.races.length > 0) {
            setRace(scheduleData.data.races[0].name);
          } else {
            setRace('');
            setSessions([]);
            setDrivers([]);
          }
        }
      } catch (error) {
        console.error("Error fetching races:", error);
      } finally {
        setIsPickerLoading(prev => ({ ...prev, races: false }));
      }
    };
    fetchRaces();
  }, [year]);

  // Fetch sessions when race changes
  useEffect(() => {
    if (!year || !race) return;
    const fetchSessions = async () => {
      setIsPickerLoading(prev => ({ ...prev, sessions: true }));
      try {
        const sessionsRes = await fetch(`/api/telemetry/sessions/${year}/${race}`);
        const sessionsData = await sessionsRes.json();
        if (sessionsData.success) {
          setSessions(sessionsData.data.sessions);
          if (sessionsData.data.sessions.length > 0) {
            setSession(sessionsData.data.sessions[0]);
          } else {
            setSession('');
            setDrivers([]);
          }
        }
      } catch (error) {
        console.error("Error fetching sessions:", error);
      } finally {
        setIsPickerLoading(prev => ({ ...prev, sessions: false }));
      }
    };
    fetchSessions();
  }, [race, year]);

  // Fetch drivers when session changes
  useEffect(() => {
    if (!year || !race || !session) return;
    const fetchDrivers = async () => {
      setIsPickerLoading(prev => ({ ...prev, drivers: true }));
      try {
        const driversRes = await fetch(`/api/info/drivers/${year}/${race}/${session}`);
        const driversData = await driversRes.json();
        if (driversData.success) {
          setDrivers(driversData.data.drivers);
          if (driversData.data.drivers.length > 1) {
            setDriver1(driversData.data.drivers[0]);
            setDriver2(driversData.data.drivers[1]);
          } else {
            setDriver1('');
            setDriver2('');
          }
        }
      } catch (error) {
        console.error("Error fetching drivers:", error);
      } finally {
        setIsPickerLoading(prev => ({ ...prev, drivers: false }));
      }
    };
    fetchDrivers();
  }, [session, race, year]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const [speedTraceRes, gearShiftsRes, trackDominanceRes] = await Promise.all([
        fetch(`/api/telemetry/speed-trace/${year}/${race}/${session}/${driver1}/${driver2}`),
        fetch(`/api/telemetry/gear-shifts/${year}/${race}/${session}/${driver1}`),
        fetch(`/api/telemetry/track-dominance/${year}/${race}/${session}?drivers=${driver1},${driver2}`),
      ]);

      const speedTraceData = await speedTraceRes.json();
      if (speedTraceData.success) {
        setSpeedTraceData(speedTraceData.data);
      }

      const gearShiftsData = await gearShiftsRes.json();
      if (gearShiftsData.success) {
        setGearShiftsData(gearShiftsData.data);
      }

      const trackDominanceData = await trackDominanceRes.json();
      if (trackDominanceData.success) {
        setTrackDominanceData(trackDominanceData.data);
      }
    } catch (error) {
      console.error("Error loading telemetry data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="F1 Telemetry"
        description="In-depth Formula 1 telemetry analysis"
      />
      <div className="container mx-auto px-4 py-8">
        <Card title="Select Telemetry Data" className="mb-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div>
                <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                <select id="year" value={year} onChange={(e) => setYear(e.target.value)} className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#e10600] focus:ring-[#e10600] sm:text-sm">
                  {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i).map((y) => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="race" className="block text-sm font-medium text-gray-700 mb-1">Race</label>
                <select id="race" value={race} onChange={(e) => setRace(e.target.value)} disabled={isPickerLoading.races} className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#e10600] focus:ring-[#e10600] sm:text-sm">
                  {races.map((r: any) => (
                    <option key={r.name} value={r.name}>{r.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="session" className="block text-sm font-medium text-gray-700 mb-1">Session</label>
                <select id="session" value={session} onChange={(e) => setSession(e.target.value)} disabled={isPickerLoading.sessions} className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#e10600] focus:ring-[#e10600] sm:text-sm">
                  {sessions.map((s: any) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="driver1" className="block text-sm font-medium text-gray-700 mb-1">Driver 1</label>
                <select id="driver1" value={driver1} onChange={(e) => setDriver1(e.target.value)} disabled={isPickerLoading.drivers} className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#e10600] focus:ring-[#e10600] sm:text-sm">
                  {drivers.map((d: any) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="driver2" className="block text-sm font-medium text-gray-700 mb-1">Driver 2</label>
                <select id="driver2" value={driver2} onChange={(e) => setDriver2(e.target.value)} disabled={isPickerLoading.drivers} className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#e10600] focus:ring-[#e10600] sm:text-sm">
                  {drivers.map((d: any) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-end">
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Loading...' : 'Load Data'}
                </Button>
              </div>
            </div>
          </form>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card title="Speed Trace">
            <div className="h-96">
              <Chart type="line" data={speedTraceData} />
            </div>
          </Card>
          <Card title="Gear Shifts">
            <div className="h-96">
              <Chart type="line" data={gearShiftsData} />
            </div>
          </Card>
        </div>

        <Card title="Track Dominance" className="mt-8">
          <div className="h-96">
            <Chart type="line" data={trackDominanceData} />
          </div>
        </Card>
      </div>
    </div>
  );
};

export default TelemetryPage;
