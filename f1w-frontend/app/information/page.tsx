"use client";

import React, { useState, useEffect } from 'react';
import PageHeader from '../components/PageHeader';
import Card from '../components/Card';
import Button from '../components/Button';

const InformationPage = () => {
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [driverStandings, setDriverStandings] = useState([]);
  const [constructorStandings, setConstructorStandings] = useState([]);
  const [schedule, setSchedule] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchInformation = async () => {
    setIsLoading(true);
    try {
      const [driversRes, constructorsRes, scheduleRes] = await Promise.all([
        fetch(`/api/info/drivers?year=${year}`),
        fetch(`/api/info/constructors?year=${year}`),
        fetch(`/api/info/schedule?year=${year}`),
      ]);

      const driversData = await driversRes.json();
      if (driversData.success) {
        setDriverStandings(driversData.data.standings);
      }

      const constructorsData = await constructorsRes.json();
      if (constructorsData.success) {
        setConstructorStandings(constructorsData.data.standings);
      }

      const scheduleData = await scheduleRes.json();
      if (scheduleData.success) {
        setSchedule(scheduleData.data.races);
      }
    } catch (error) {
      console.error("Error fetching information:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="F1 Information"
        description={`Driver standings, constructor standings, and race schedule for ${year}`}
      />
      <div className="container mx-auto px-4 py-8">
        <Card title="Select Year" className="mb-8">
          <div className="flex items-center space-x-4">
            <select
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#e10600] focus:ring-[#e10600] sm:text-sm"
            >
              {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i).map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
            <Button onClick={fetchInformation} disabled={isLoading}>
              {isLoading ? 'Loading...' : 'Load Data'}
            </Button>
          </div>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card title="Driver Standings">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="text-left">Pos</th>
                  <th className="text-left">Driver</th>
                  <th className="text-left">Team</th>
                  <th className="text-right">Points</th>
                </tr>
              </thead>
              <tbody>
                {driverStandings.map((driver: any) => (
                  <tr key={driver.driverName}>
                    <td>{driver.position}</td>
                    <td>{driver.driverName}</td>
                    <td>{driver.teamName}</td>
                    <td className="text-right">{driver.points}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>

          <Card title="Constructor Standings">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="text-left">Pos</th>
                  <th className="text-left">Team</th>
                  <th className="text-right">Points</th>
                </tr>
              </thead>
              <tbody>
                {constructorStandings.map((team: any) => (
                  <tr key={team.teamName}>
                    <td>{team.position}</td>
                    <td>{team.teamName}</td>
                    <td className="text-right">{team.points}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </div>

        <Card title="Race Schedule" className="mt-8">
          <table className="w-full">
            <thead>
              <tr>
                <th className="text-left">Round</th>
                <th className="text-left">Race</th>
                <th className="text-left">Location</th>
                <th className="text-left">Country</th>
              </tr>
            </thead>
            <tbody>
              {schedule.map((race: any) => (
                <tr key={race.round}>
                  <td>{race.round}</td>
                  <td>{race.name}</td>
                  <td>{race.location}</td>
                  <td>{race.country}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>
    </div>
  );
};

export default InformationPage;
