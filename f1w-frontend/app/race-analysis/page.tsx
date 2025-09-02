"use client";

import React, { useState, useEffect } from 'react';
import PageHeader from '../components/PageHeader';
import Card from '../components/Card';
import Button from '../components/Button';
import ViolinPlot from '../components/victory-charts/ViolinPlot';
import Chart from '../components/charts/Chart';

const RaceAnalysisPage = () => {
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [races, setRaces] = useState([]);
  const [drivers, setDrivers] = useState([]); // This will hold available drivers
  const [race, setRace] = useState('');
  const [analysisType, setAnalysisType] = useState('race-pace');
  const [session, setSession] = useState('R');
  const [selectedDrivers, setSelectedDrivers] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isPickerLoading, setIsPickerLoading] = useState({ races: false, drivers: false });
  const [racePaceData, setRacePaceData] = useState(null);
  const [teamPaceData, setTeamPaceData] = useState(null);
  const [lapSectionsData, setLapSectionsData] = useState(null);

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

  // Fetch drivers when race or session changes
  useEffect(() => {
    if (!year || !race) return;
    const fetchDrivers = async () => {
      setIsPickerLoading(prev => ({ ...prev, drivers: true }));
      try {
        // Assuming a new endpoint to get drivers for a specific race session
        const driversRes = await fetch(`/api/info/drivers/${year}/${race}/${session}`);
        const driversData = await driversRes.json();
        if (driversData.success) {
          setDrivers(driversData.data.drivers);
        } else {
          setDrivers([]);
        }
      } catch (error) {
        console.error("Error fetching drivers:", error);
        setDrivers([]);
      } finally {
        setIsPickerLoading(prev => ({ ...prev, drivers: false }));
      }
    };
    fetchDrivers();
  }, [year, race, session]);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Reset previous data
    setRacePaceData(null);
    setTeamPaceData(null);
    setLapSectionsData(null);

    try {
      if (analysisType === 'race-pace') {
        const response = await fetch(`/api/race-analysis/race-pace/${year}/${race}?drivers=${selectedDrivers}`);
        const data = await response.json();
        if (data.success) {
          setRacePaceData(data.data);
        }
      } else if (analysisType === 'team-pace') {
        const response = await fetch(`/api/race-analysis/team-pace/${year}/${race}`);
        const data = await response.json();
        if (data.success) {
          setTeamPaceData(data.data);
        }
      } else if (analysisType === 'lap-sections') {
        const response = await fetch(`/api/race-analysis/lap-sections/${year}/${race}/${session}?drivers=${selectedDrivers}`);
        const data = await response.json();
        if (data.success) {
          setLapSectionsData(data.data);
        }
      }
    } catch (error) {
      console.error("Error loading race analysis data:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const availableDriversString = drivers.join(', ');

  return (
    <div>
      <PageHeader
        title="F1 Race Analysis"
        description="Interactive Formula 1 race data analysis"
      />
      <div className="container mx-auto px-4 py-8">
        <Card title="Select Data to Analyze" className="mb-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
              <div>
                <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                <select
                  id="year"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#e10600] focus:ring-[#e10600] sm:text-sm"
                >
                  {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i).map((y) => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="race" className="block text-sm font-medium text-gray-700 mb-1">Race</label>
                <select
                  id="race"
                  value={race}
                  onChange={(e) => setRace(e.target.value)}
                  disabled={isPickerLoading.races}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#e10600] focus:ring-[#e10600] sm:text-sm"
                >
                  {races.map((r: any) => (
                    <option key={r.name} value={r.name}>{r.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="analysisType" className="block text-sm font-medium text-gray-700 mb-1">Analysis Type</label>
                <select
                  id="analysisType"
                  value={analysisType}
                  onChange={(e) => setAnalysisType(e.target.value)}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#e10600] focus:ring-[#e10600] sm:text-sm"
                >
                  <option value="race-pace">Race Pace</option>
                  <option value="team-pace">Team Pace</option>
                  <option value="lap-sections">Lap Sections</option>
                </select>
              </div>
              <div>
                <label htmlFor="session" className="block text-sm font-medium text-gray-700 mb-1">Session</label>
                <select
                  id="session"
                  value={session}
                  onChange={(e) => setSession(e.target.value)}
                  disabled={analysisType === 'race-pace' || analysisType === 'team-pace'}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#e10600] focus:ring-[#e10600] sm:text-sm disabled:bg-gray-100"
                >
                  <option value="R">Race</option>
                  <option value="Q">Qualifying</option>
                  <option value="FP1">Practice 1</option>
                  <option value="FP2">Practice 2</option>
                  <option value="FP3">Practice 3</option>
                </select>
              </div>
              <div>
                <label htmlFor="drivers" className="block text-sm font-medium text-gray-700 mb-1">Drivers (optional)</label>
                <input
                  type="text"
                  id="drivers"
                  value={selectedDrivers}
                  onChange={(e) => setSelectedDrivers(e.target.value)}
                  placeholder="VER,HAM,LEC"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#e10600] focus:ring-[#e10600] sm:text-sm"
                />
                 <p className="text-xs text-gray-500 mt-1">
                  Available: {isPickerLoading.drivers ? 'Loading...' : availableDriversString}
                </p>
              </div>
              <div className="flex items-end">
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Loading...' : 'Load Data'}
                </Button>
              </div>
            </div>
          </form>
        </Card>

        {analysisType === 'race-pace' && (
          <Card title="Race Pace Comparison" className="mb-8">
            <div className="h-96">
              <ViolinPlot data={racePaceData} />
            </div>
          </Card>
        )}

        {analysisType === 'team-pace' && (
          <Card title="Team Pace Comparison" className="mb-8">
            <div className="h-96">
              <Chart type="bar" data={teamPaceData} />
            </div>
          </Card>
        )}

        {analysisType === 'lap-sections' && (
          <Card title="Lap Sections Analysis" className="mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {lapSectionsData &&
                (lapSectionsData as any).sections.map((section: any) => (
                  <div key={section.name}>
                    <h3 className="text-lg font-semibold mb-3">{section.name.replace('_', ' ')}</h3>
                    <div className="h-64">
                      <Chart type="line" data={section} />
                    </div>
                  </div>
                ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default RaceAnalysisPage;
