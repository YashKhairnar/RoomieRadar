import React, { useState, useEffect } from 'react';
import {MapPin, Calendar, Users, Home, Heart, Search, ChevronDown, ChevronUp } from 'lucide-react';
import { Slider } from '@heroui/slider';
// import {Slider} from "@heroui/react";

const RoommateFilter = ({roommates, setRoommates, setCurrentIndex}) => {
  const [allRoommates, setAllRoommates] = useState(roommates);
  const [filteredRoommates, setFilteredRoommates] = useState(roommates);

  const [filters, setFilters] = useState({
    // Basic filters
    ageRange: [18, 35],
    gender: [],
    budget: [1500, 4000],
    location: '',
    // Housing preferences
    housingType: '',
    moveInDate: '',
    leaseDuration: '',
    // Lifestyle
    smoking: '',
    drinking: '',
    pets: '',
    cleanliness: 1,
    noiseLevel: 1,
    // Schedule
    sleepSchedule: '',
    cookingFrequency: '',
    // Interests
    selectedInterests: [],
    // Verification
    verified: false,
  });

  useEffect(()=>{
    console.log('Filters updated:', filters);
  },[filters])
  

  useEffect(()=>{
    console.log('Roommates filtered: ', filteredRoommates);
  },[filteredRoommates]) 
   
  useEffect(() => {
    console.log('Roomates: ',roommates)
  }
  , [roommates]);
  
  useEffect(() => {
        setRoommates(filteredRoommates);
    }, [filteredRoommates]);

  // State to manage expanded sections
  const [expandedSections, setExpandedSections] = useState({
        basic: true,
        housing: false,
        lifestyle: false,
        schedule: false,
        interests: false,
        verification: false
     });

  const filterAll = () => {
      let result = roommates;
      const { ageRange, gender, budget, location, housingType, moveInDate,selectedInterests, 
              smoking, drinking, pets, cleanliness, noiseLevel
        } = filters;

      result = result.filter(r => {
        const genderOK = gender.length === 0 || gender.includes(r.gender);
        const ageOK = r.age >= ageRange[0] && r.age <= ageRange[1];

        //housing preferences
        const budgetOK = r.budget_min <= budget[0] && r.budget_max >= budget[1];
        const housingOK = r.preferred_room_type === housingType
        const moveinOk = !moveInDate || new Date(r.move_in_date) <= new Date(moveInDate);

        // interests
        const h = r.hobbies.split(',')
        // console.log('Hobbies: ', h, ' vs ', selectedInterests);
        const interestsOk = selectedInterests.length === 0 || selectedInterests.some(interest => h.includes(interest));

        //location
        console.log('Location: ', r.preferred_location, ' vs ', location);
        const locationOK = r.preferred_location.toLowerCase() == location.toLowerCase();

        //lifestyle preferences
        const smokingOK = r.smoking_allowed === smoking;
        const drinkingOK = r.drinking_allowed === drinking;
        const petsOK = r.pets_allowed === pets;
        const cleanlinessOK = r.cleanlinessLevel == cleanliness
        const noiseLevelOK = r.noiseTolerance == noiseLevel

        //sleep schedule and cooking frequency
        const sleepScheduleOK = !filters.sleepSchedule || r.sleepSchedule === filters.sleepSchedule;
        const cookingFrequencyOK = !filters.cookingFrequency || r.cookingFrequency === filters.cookingFrequency;

        //verification
        const verifiedOK = !filters.verified || r.verified === filters.verified;

        // Combine all conditions
        return (
          genderOK && ageOK && budgetOK && housingOK && moveinOk && interestsOk &&
          locationOK && smokingOK && drinkingOK && petsOK && cleanlinessOK &&
          noiseLevelOK && sleepScheduleOK && cookingFrequencyOK && verifiedOK
        );
      });
      setFilteredRoommates(result);
    };

  // Sample data for dropdowns
  const genderOptions = ['Male', 'Female'];
  const housingTypes = ['Private Room', 'Shared Room'];
  const sleepScheduleOptions = ['Early Bird', 'Night Owl', 'Flexible'];
  const cookingOptions = ['Never', 'Rarely', 'Weekly', 'Daily'];
  const interests = [
    "Reading",
    "Traveling",
    "Cooking",
    "Gardening",
    "Listening to Music",
    "Watching Movies",
    "Fitness/Working Out",
    "Photography",
    "Drawing/Painting",
    "Dancing",
    "Hiking",
    "Fishing",
    "Playing Sports",
    "Gaming",
    "Writing",
    "Yoga",
    "Crafting/DIY",
    "Meditation",
    "Learning Languages",
    "Volunteering"
  ];

  const handleFilterChange = (category, value) => {
    setFilters(prev => ({
      ...prev,
      [category]: value
    }));
  };

  const handleArrayFilter = (category, value) => {
    setFilters(prev => ({
      ...prev,
      [category]: prev[category].includes(value)
        ? prev[category].filter(item => item !== value)
        : [...prev[category], value]
    }));
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
        [section]: !prev[section],
        ...Object.keys(prev).reduce((acc, key) => {
          if (key !== section) acc[key] = false; // Collapse other sections
          return acc;
        }, {})
        }));
    }
    
  const clearAllFilters = () => {
    setFilters({
      ageRange: [18, 35],
      gender: [],
      budget: [500, 2000],
      location: '',
      housingType: '',
      moveInDate: '',
      leaseDuration: '',
      smoking: '',
      drinking: '',
      pets: '',
      cleanliness: [],
      noiseLevel: [],
      sleepSchedule: '',
      cookingFrequency: '',
      selectedInterests: [],
      verified: false,
    });
    setRoommates(allRoommates);
    setFilteredRoommates(allRoommates);
    setCurrentIndex(0);
  };


  const FilterSection = ({ title, icon: Icon, sectionKey, children }) => (
    <div className="border-b border-gray-200 pb-4">
      <button
        onClick={() => toggleSection(sectionKey)}
        className="flex items-center justify-between w-full text-left"
      >
        <div className="flex items-center gap-2">
          <Icon className="w-4 h-4 text-purple-600" />
          <h3 className="font-semibold text-gray-800">{title}</h3>
        </div>
        {expandedSections[sectionKey] ? 
          <ChevronUp className="w-4 h-4 text-gray-500" /> : 
          <ChevronDown className="w-4 h-4 text-gray-500" />
        }
      </button>
      {expandedSections[sectionKey] && (
        <div className="mt-4 space-y-4">
          {children}
        </div>
      )}
    </div>
  );

  return (
    <div className="w-80 bg-white border-r overflow-y-auto shadow-lg p-4 space-y-6">
      {/* Filter Sidebar */}
        <div className="flex flex-col ">
          {/* Filter Content */}
          <div className="flex-1 overflow-y-auto space-y-8">
            {/* Basic Information */}
            <FilterSection title="Basic Info" icon={Users} sectionKey="basic">
              <div className="space-y-4">
                                <div>
                  <label htmlFor="ageRange" className="text-sm text-purple-600 flex items-center justify-between mb-2">
                    Age Range : <span className="text-gray-700">{filters.ageRange[0]} - {filters.ageRange[1]}</span>
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      min={18}
                      max={100}
                      value={filters.ageRange[0]}
                      onChange={(e) =>
                        handleFilterChange('ageRange', [parseInt(e.target.value), filters.ageRange[1]])
                      }
                      className="w-1/2 p-2 border text-gray-600 border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500"
                      placeholder="Min"
                    />
                    <input
                      type="number"
                      min={18}
                      max={100}
                      value={filters.ageRange[1]}
                      onChange={(e) =>
                        handleFilterChange('ageRange', [filters.ageRange[0], parseInt(e.target.value)])
                      }
                      className="w-1/2 p-2 border border-gray-300 rounded-lg text-sm text-gray-600 focus:ring-2 focus:ring-purple-500"
                      placeholder="Max"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm text-purple-600 mb-2 block">Gender</label>
                  <div className="flex flex-wrap gap-2">
                    {genderOptions.map(gender => (
                      <button
                        key={gender}
                        onClick={() => handleArrayFilter('gender', gender)}
                        className={`px-3 py-1 rounded-full text-xs border transition-colors ${
                          filters.gender.includes(gender)
                            ? 'bg-purple-100 border-purple-300 text-purple-700'
                            : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        {gender}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-sm text-purple-600 mb-2 block">Location</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Enter city or area"
                      value={filters.location}
                      onChange={(e) => handleFilterChange('location', e.target.value)}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 text-gray-500 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            </FilterSection>

            {/* Housing Preferences */}
            <FilterSection title="Housing Preferences" icon={Home} sectionKey="housing">
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-purple-600 mb-2 block">Budget</label>
                  <div className='flex items-center gap-2 mb-4'>
                    <input
                      type="number"
                      value={filters.budget[0]}
                      onChange={(e) => handleFilterChange('budget', [parseInt(e.target.value), filters.budget[1]])}
                      className="bg-gray-100 p-2 text-black text-sm border border-gray-300 rounded-lg w-full"
                      placeholder="min"
                    />
                    <span className="text-gray-400">-</span>
                    <input
                      type="number"
                      value={filters.budget[1]}
                      onChange={(e) => handleFilterChange('budget', [filters.budget[0], parseInt(e.target.value)])}
                      className="bg-gray-100 p-2 text-black text-sm border border-gray-300 rounded-lg w-full"
                      placeholder="max"
                    />
                  </div>
                </div>
                {/* <div>
                  <label className="text-sm text-purple-600 mb-2 block">Lease Duration</label>
                  <select
                    value={filters.leaseDuration}
                    onChange={(e) => handleFilterChange('leaseDuration', e.target.value)}
                    className="text-gray-500 text-sm w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="">Any</option>
                    <option value="short-term">3 Months</option>
                    <option value="long-term">6 Months</option>
                    <option value="yearly">12 Months</option>
                    <option value="flexible">1+ years</option>
                  </select>
                </div> */}
                <div>
                  <label className="text-sm text-purple-600 mb-2 block">Housing Type</label>
                  <div className="grid grid-cols-2 gap-2">
                    {housingTypes.map(type => (
                      <button
                        key={type}
                        onClick={() => handleFilterChange('housingType', type)}
                        className={`p-2 text-xs border rounded-lg transition-colors ${
                          filters.housingType.includes(type)
                            ? 'bg-purple-100 border-purple-300 text-purple-700'
                            : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-sm text-purple-600 mb-2 block">Move-in Date</label>
                  <input
                    type="date"
                    value={filters.moveInDate}
                    onChange={(e) => handleFilterChange('moveInDate', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>
            </FilterSection>

            {/* Lifestyle */}
            <FilterSection title="Lifestyle" icon={Heart} sectionKey="lifestyle">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className='flex items-center gap-2'>
                    <label className="text-sm text-purple-600 block">Smoking</label>
                    <button
                      type="button"
                      aria-pressed={filters.smoking === true}
                      onClick={() => handleFilterChange('smoking', filters.smoking === true ? false : true)}
                      className={`w-10 h-6 flex items-center bg-gray-200 rounded-full p-1 transition-colors ${filters.smoking === true ? 'bg-purple-500' : ''}`}
                    >
                      <span className={`bg-white w-4 h-4 rounded-full shadow transform transition-transform ${filters.smoking === true ? 'translate-x-4' : ''}`}></span>
                    </button>
                  </div>
                  <div className='flex items-center gap-2'>
                    <label className="text-sm text-purple-600 block">Drinking</label>
                    <button
                      type="button"
                      aria-pressed={filters.drinking === true}
                      onClick={() => handleFilterChange('drinking', filters.drinking === true ? false : true)}
                      className={`w-10 h-6 flex items-center bg-gray-200 rounded-full p-1 transition-colors ${filters.drinking === true ? 'bg-purple-500' : ''}`}
                    >
                      <span className={`bg-white w-4 h-4 rounded-full shadow transform transition-transform ${filters.drinking === true ? 'translate-x-4' : ''}`}></span>
                    </button>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-sm text-purple-600 block">Pets</label>
                  <button
                    type="button"
                    aria-pressed={filters.pets === true}
                    onClick={() => handleFilterChange('pets', filters.pets === true ? false : true)}
                    className={`w-10 h-6 flex items-center bg-gray-200 rounded-full p-1 transition-colors ${filters.pets === true ? 'bg-purple-500' : ''}`}
                  >
                    <span className={`bg-white w-4 h-4 rounded-full shadow transform transition-transform ${filters.pets === true ? 'translate-x-4' : ''}`}></span>
                  </button>
                </div>
                <div>
                  <label htmlFor="Cleanliness" className='text-sm text-purple-600 flex items-center justify-between'>
                    Cleanliness Level: <span className="ml-2 text-gray-700">{filters.cleanliness} / 5</span>
                  </label>
                  <input
                    type="range"
                    min={1}
                    max={5}
                    step={1}
                    value={filters.cleanliness}
                    onChange={(e) => handleFilterChange('cleanliness', parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-500"
                    style={{ accentColor: '#6b46c1' }}
                  />
                </div>
                <div>
                  <label htmlFor="Noise Level" className='text-sm text-purple-600 flex items-center justify-between'>
                    Noise Tolerance: <span className="ml-2 text-gray-700">{filters.noiseLevel} / 5</span>
                  </label>
                  <input
                    type="range"
                    min={1}
                    max={5}
                    step={1}
                    value={filters.noiseLevel}
                    onChange={(e) => handleFilterChange('noiseLevel', parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-500"
                    style={{ accentColor: '#6b46c1' }}
                  />
                </div>
              </div>
            </FilterSection>

            {/* Schedule & Habits */}
            <FilterSection title="Schedule" icon={Calendar} sectionKey="schedule">
              <div>
                <label className="text-sm  text-purple-600 mb-2 block">Sleep Schedule</label>
                <select
                  value={filters.sleepSchedule}
                  onChange={(e) => handleFilterChange('sleepSchedule', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="">Any</option>
                  {sleepScheduleOptions.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>

             

              <div>
                <label className="text-sm  text-purple-600 mb-2 block">Cooking Frequency</label>
                <select
                  value={filters.cookingFrequency}
                  onChange={(e) => handleFilterChange('cookingFrequency', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="">Any</option>
                  {cookingOptions.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
            </FilterSection>

            {/* Interests */}
            <FilterSection title="Interests" icon={Heart} sectionKey="interests">
              <div className="grid grid-cols-2 gap-2">
                {interests.map(interest => (
                  <button
                    key={interest}
                    onClick={() => handleArrayFilter('selectedInterests', interest)}
                    className={`p-2 text-xs border rounded-lg transition-colors ${
                      filters.selectedInterests.includes(interest)
                        ? 'bg-purple-100 border-purple-300 text-purple-700'
                        : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {interest}
                  </button>
                ))}
              </div>
            </FilterSection>

            {/* Verification */}
            <FilterSection title="Verification" icon={Search} sectionKey="verification">
              <div className="space-y-3">
                {[
                  { key: 'verified', label: 'Verified Profile' },
                  { key: 'all', label: 'All' },
                ].map(item => (
                  <label key={item.key} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters[item.key]}
                      onChange={(e) => handleFilterChange(item.key, e.target.checked)}
                      className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                    />
                    <span className="text-sm text-gray-700">{item.label}</span>
                  </label>
                ))}
              </div>
            </FilterSection>
          </div>

          {/* Footer */}
          <div className="pt-3 border-t border-gray-200">
            <div className="flex gap-2">
              <button
                onClick={clearAllFilters}
                className="flex-1 px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Clear All
              </button>
              <button
                onClick={filterAll}
                className="flex-1 px-4 py-2 text-sm text-white bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg hover:opacity-90 transition-opacity">
                Apply Filters
              </button>
            </div>
          </div>

        </div>
 </div>

  );
};

export default RoommateFilter;