import React, { useState, useCallback } from 'react';
import { MapPin, Calendar, Users, Home, Heart, Search, ChevronDown, ChevronUp } from 'lucide-react';

type Roommate = {
  id: number;
  user_id: number;
  first_name: string;
  last_name: string;
  gender: string;
  age: number;
  occupation: string;
  bio: string;
  preferred_location: string;
  preferred_room_type: string;
  hobbies: string;
  pets_allowed: boolean;
  smoking_allowed: boolean;
  drinking_allowed: boolean;
  sleepSchedule: string;
  cookingFrequency: string;
  cleanlinessLevel: number;
  noiseTolerance: number;
  socialInteraction: number;
  move_in_date: string;
  move_out_date?: string;
  budget_min: number;
  budget_max: number;
  verified: boolean;
  image_url: string;
  vibe_score: number;
};

interface Props {
  roommates: Roommate[];
  setRoommates: (roommates: Roommate[]) => void;
  setCurrentIndex: (index: number) => void;
}

type Filters = {
  ageRange: [number, number];
  gender: string[];
  budget: [number, number];
  location: string;
  housingType: string;
  moveInDate: string;
  leaseDuration: string;
  smoking: boolean | '';
  drinking: boolean | '';
  pets: boolean | '';
  cleanliness: number | '';
  noiseLevel: number | '';
  sleepSchedule: string;
  cookingFrequency: string;
  selectedInterests: string[];
  verified: boolean;
};

const RoommateFilter: React.FC<Props> = ({ roommates, setRoommates, setCurrentIndex,  }) => {
  const [filters, setFilters] = useState<Filters>({
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
    cleanliness: '',
    noiseLevel: '',
    // Schedule
    sleepSchedule: '',
    cookingFrequency: '',
    // Interests
    selectedInterests: [],
    // Verification
    verified: false,
  });

  const verificationOptions: { key: keyof typeof filters; label: string }[] = [
    { key: 'verified', label: 'Verified Profile' },
  ];

  // State to manage expanded sections
  const [expandedSections, setExpandedSections] = useState({
    basic: true,
    housing: false,
    lifestyle: false,
    schedule: false,
    interests: false,
    verification: false
  });

  const applyFilters = useCallback(() => {
    console.log('Applying filters:', filters);
    console.log('Original roommates:', roommates);
    
    let result = roommates.filter(r => {
      const { 
        ageRange, gender, budget, location, housingType, moveInDate, selectedInterests, 
        smoking, drinking, pets, cleanliness, noiseLevel, sleepSchedule, cookingFrequency, verified
      } = filters;

      // Basic filters
      const genderOK = gender.length === 0 || gender.includes(r.gender);
      const ageOK = r.age >= ageRange[0] && r.age <= ageRange[1];
      
      // Budget - check if roommate's budget range overlaps with filter range
      const budgetOK = r.budget_min <= budget[1] && r.budget_max >= budget[0];
      
      // Location - handle empty location and use includes for partial matching
      const locationOK = !location || r.preferred_location.toLowerCase().includes(location.toLowerCase());
      
      // Housing preferences
      const housingOK = !housingType || r.preferred_room_type === housingType;
      const moveinOk = !moveInDate || new Date(r.move_in_date) <= new Date(moveInDate);
      
      // Interests - trim whitespace from hobbies and handle empty arrays
      const h = r.hobbies ? r.hobbies.split(',').map(hobby => hobby.trim()) : [];
      const interestsOk = selectedInterests.length === 0 || selectedInterests.some(interest => h.includes(interest));
      
      // Lifestyle preferences - handle empty string cases (no preference)
      const smokingOK = smoking === '' || r.smoking_allowed === smoking;
      const drinkingOK = drinking === '' || r.drinking_allowed === drinking;
      const petsOK = pets === '' || r.pets_allowed === pets;
      const cleanlinessOK = cleanliness === '' || r.cleanlinessLevel === cleanliness;
      const noiseLevelOK = noiseLevel === '' || r.noiseTolerance === noiseLevel;
      
      // Schedule
      const sleepScheduleOK = !sleepSchedule || r.sleepSchedule === sleepSchedule;
      const cookingFrequencyOK = !cookingFrequency || r.cookingFrequency === cookingFrequency;
      
      // Verification
      const verifiedOK = !verified || r.verified === verified;
      
      // Debug logging for first roommate
      if (r === roommates[0]) {
        console.log('Debug first roommate:', {
          name: `${r.first_name} ${r.last_name}`,
          genderOK, ageOK, budgetOK, housingOK, moveinOk, interestsOk,
          locationOK, smokingOK, drinkingOK, petsOK, cleanlinessOK,
          noiseLevelOK, sleepScheduleOK, cookingFrequencyOK, verifiedOK,
          roommate: r
        });
      }
      
      // Combine all conditions
      return (
        genderOK && ageOK && budgetOK && housingOK && moveinOk && interestsOk &&
        locationOK && smokingOK && drinkingOK && petsOK && cleanlinessOK &&
        noiseLevelOK && sleepScheduleOK && cookingFrequencyOK && verifiedOK
      );
    });
    
    console.log('Filtered results:', result);
    setRoommates(result);
    setCurrentIndex(0);
  }, [roommates, filters, setRoommates, setCurrentIndex]);

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

  const handleFilterChange = (category: keyof Filters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [category]: value
    }));
  };

  const handleArrayFilter = (category: keyof Filters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [category]: (prev[category] as any[]).includes(value)
        ? (prev[category] as any[]).filter(item => item !== value)
        : [...(prev[category] as any[]), value]
    }));
  };

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => {
      const updated: typeof prev = Object.keys(prev).reduce((acc, key) => {
        acc[key as keyof typeof prev] = key === section ? !prev[key as keyof typeof prev] : false;
        return acc;
      }, {} as typeof prev);
      return updated;
    });
  };
    
  const clearAllFilters = () => {
    setFilters({
      ageRange: [18, 35],
      gender: [],
      budget: [1500, 4000],
      location: '',
      housingType: '',
      moveInDate: '',
      leaseDuration: '',
      smoking: '',
      drinking: '',
      pets: '',
      cleanliness: '',
      noiseLevel: '',
      sleepSchedule: '',
      cookingFrequency: '',
      selectedInterests: [],
      verified: false,
    });
    // Reset to original data
    setRoommates(roommates)
  };

  const FilterSection: React.FC<{
    title: string;
    icon: React.ElementType;
    sectionKey: 'basic' | 'housing' | 'lifestyle' | 'schedule' | 'interests' | 'verification';
    children: React.ReactNode;
  }> = ({ title, icon: Icon, sectionKey, children }) => (
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
      <div className="flex flex-col">
        {/* Header */}
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Filters</h2>
          <p className="text-sm text-gray-500">
            {roommates.length} roommate{roommates.length !== 1 ? 's' : ''} available
          </p>
        </div>

        {/* Filter Content */}
        <div className="flex-1 overflow-y-auto space-y-6">
          {/* Basic Information */}
          <FilterSection title="Basic Info" icon={Users} sectionKey="basic">
            <div className="space-y-4">
              <div>
                <label htmlFor="ageRange" className="text-sm text-purple-600 flex items-center justify-between mb-2">
                  Age Range: <span className="text-gray-700">{filters.ageRange[0]} - {filters.ageRange[1]}</span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    min={18}
                    max={100}
                    value={filters.ageRange[0]}
                    onChange={(e) =>
                      handleFilterChange('ageRange', [parseInt(e.target.value) || 18, filters.ageRange[1]])
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
                      handleFilterChange('ageRange', [filters.ageRange[0], parseInt(e.target.value) || 35])
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
                <label className="text-sm text-purple-600 mb-2 block">Budget Range</label>
                <div className='flex items-center gap-2 mb-4'>
                  <input
                    type="number"
                    value={filters.budget[0]}
                    onChange={(e) => handleFilterChange('budget', [parseInt(e.target.value) || 1500, filters.budget[1]])}
                    className="bg-gray-100 p-2 text-black text-sm border border-gray-300 rounded-lg w-full"
                    placeholder="min"
                  />
                  <span className="text-gray-400">-</span>
                  <input
                    type="number"
                    value={filters.budget[1]}
                    onChange={(e) => handleFilterChange('budget', [filters.budget[0], parseInt(e.target.value) || 4000])}
                    className="bg-gray-100 p-2 text-black text-sm border border-gray-300 rounded-lg w-full"
                    placeholder="max"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm text-purple-600 mb-2 block">Housing Type</label>
                <div className="grid grid-cols-2 gap-2">
                  {housingTypes.map(type => (
                    <button
                      key={type}
                      onClick={() => handleFilterChange('housingType', filters.housingType === type ? '' : type)}
                      className={`p-2 text-xs border rounded-lg transition-colors ${
                        filters.housingType === type
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
                <label className="text-sm text-purple-600 mb-2 block">Move-in Date (Latest)</label>
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
                    onClick={() => handleFilterChange('smoking', filters.smoking === true ? '' : true)}
                    className={`w-10 h-6 flex items-center bg-gray-200 rounded-full p-1 transition-colors ${filters.smoking === true ? 'bg-purple-500' : ''}`}
                  >
                    <span className={`bg-white w-4 h-4 rounded-full shadow transform transition-transform ${filters.smoking === true ? 'translate-x-4' : ''}`}></span>
                  </button>
                </div>
                <div className='flex items-center gap-2'>
                  <label className="text-sm text-purple-600 block">Drinking</label>
                  <button
                    type="button"
                    onClick={() => handleFilterChange('drinking', filters.drinking === true ? '' : true)}
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
                  onClick={() => handleFilterChange('pets', filters.pets === true ? '' : true)}
                  className={`w-10 h-6 flex items-center bg-gray-200 rounded-full p-1 transition-colors ${filters.pets === true ? 'bg-purple-500' : ''}`}
                >
                  <span className={`bg-white w-4 h-4 rounded-full shadow transform transition-transform ${filters.pets === true ? 'translate-x-4' : ''}`}></span>
                </button>
              </div>
              <div>
                <label className='text-sm text-purple-600 mb-2 block'>Cleanliness Level</label>
                <select
                  value={filters.cleanliness}
                  onChange={(e) => handleFilterChange('cleanliness', e.target.value === '' ? '' : parseInt(e.target.value))}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">Any Level</option>
                  <option value={1}>1 - Very Relaxed</option>
                  <option value={2}>2 - Relaxed</option>
                  <option value={3}>3 - Moderate</option>
                  <option value={4}>4 - Clean</option>
                  <option value={5}>5 - Very Clean</option>
                </select>
              </div>
              <div>
                <label className='text-sm text-purple-600 mb-2 block'>Noise Tolerance</label>
                <select
                  value={filters.noiseLevel}
                  onChange={(e) => handleFilterChange('noiseLevel', e.target.value === '' ? '' : parseInt(e.target.value))}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">Any Level</option>
                  <option value={1}>1 - Very Quiet</option>
                  <option value={2}>2 - Quiet</option>
                  <option value={3}>3 - Moderate</option>
                  <option value={4}>4 - Tolerant</option>
                  <option value={5}>5 - Very Tolerant</option>
                </select>
              </div>
            </div>
          </FilterSection>

          {/* Schedule & Habits */}
          <FilterSection title="Schedule" icon={Calendar} sectionKey="schedule">
            <div className="space-y-4">
              <div>
                <label className="text-sm text-purple-600 mb-2 block">Sleep Schedule</label>
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
                <label className="text-sm text-purple-600 mb-2 block">Cooking Frequency</label>
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
              {verificationOptions.map(item => (
                <label key={item.key} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={Boolean(filters[item.key])}
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
              onClick={applyFilters}
              className="flex-1 px-4 py-2 text-sm text-white bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg hover:opacity-90 transition-opacity"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoommateFilter;