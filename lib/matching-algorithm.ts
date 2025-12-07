import { User } from './types';

export interface MatchScore {
  userId: string;
  score: number;
  breakdown: {
    interests: number;
    traits: number;
    goals: number;
    location: number;
    age: number;
    lifestyle: number;
  };
  reasons: string[];
}

/**
 * Calculate compatibility score between two users
 * Score is between 0-100
 */
export function calculateMatchScore(user1: User, user2: User): MatchScore {
  const breakdown = {
    interests: calculateInterestsScore(user1.interests, user2.interests),
    traits: calculateTraitsScore(user1.traits, user2.traits),
    goals: calculateGoalsScore(user1.relationshipGoal, user2.relationshipGoal),
    location: calculateLocationScore(user1.location, user2.location, user1.preferences?.maxDistance || 50),
    age: calculateAgeScore(user1.age, user2.age, user1.preferences?.ageRange),
    lifestyle: calculateLifestyleScore(user1, user2)
  };

  // Weighted average
  const weights = {
    interests: 0.25,
    traits: 0.20,
    goals: 0.20,
    location: 0.15,
    age: 0.10,
    lifestyle: 0.10
  };

  const totalScore = 
    breakdown.interests * weights.interests +
    breakdown.traits * weights.traits +
    breakdown.goals * weights.goals +
    breakdown.location * weights.location +
    breakdown.age * weights.age +
    breakdown.lifestyle * weights.lifestyle;

  const reasons = generateMatchReasons(breakdown, user1, user2);

  return {
    userId: user2.id,
    score: Math.round(totalScore),
    breakdown,
    reasons
  };
}

/**
 * Calculate interests compatibility (0-100)
 */
function calculateInterestsScore(interests1: string[], interests2: string[]): number {
  if (!interests1.length || !interests2.length) return 50;

  const set1 = new Set(interests1.map(i => i.toLowerCase()));
  const set2 = new Set(interests2.map(i => i.toLowerCase()));
  
  const intersection = new Set([...set1].filter(x => set2.has(x)));
  const union = new Set([...set1, ...set2]);
  
  // Jaccard similarity * 100
  const similarity = (intersection.size / union.size) * 100;
  
  // Bonus for having many common interests
  const commonCount = intersection.size;
  const bonus = Math.min(commonCount * 5, 20);
  
  return Math.min(similarity + bonus, 100);
}

/**
 * Calculate personality traits compatibility (0-100)
 */
function calculateTraitsScore(traits1: string[], traits2: string[]): number {
  if (!traits1.length || !traits2.length) return 50;

  // Define complementary and compatible trait pairs
  const complementary: { [key: string]: string[] } = {
    'adventurous': ['spontaneous', 'outdoorsy', 'active'],
    'introverted': ['thoughtful', 'creative', 'calm'],
    'extroverted': ['outgoing', 'social', 'energetic'],
    'ambitious': ['driven', 'motivated', 'goal-oriented'],
    'creative': ['artistic', 'imaginative', 'expressive'],
    'intellectual': ['curious', 'analytical', 'thoughtful']
  };

  let score = 50;
  const set1 = new Set(traits1.map(t => t.toLowerCase()));
  const set2 = new Set(traits2.map(t => t.toLowerCase()));

  // Direct matches
  const matches = [...set1].filter(t => set2.has(t)).length;
  score += matches * 10;

  // Complementary traits
  for (const trait of set1) {
    if (complementary[trait]) {
      const complementaryMatches = complementary[trait].filter(c => set2.has(c)).length;
      score += complementaryMatches * 5;
    }
  }

  return Math.min(score, 100);
}

/**
 * Calculate relationship goals compatibility (0-100)
 */
function calculateGoalsScore(goal1?: string, goal2?: string): number {
  if (!goal1 || !goal2) return 50;

  const goalCompatibility: { [key: string]: { [key: string]: number } } = {
    'marriage': { 'marriage': 100, 'relationship': 80, 'casual': 20, 'friendship': 30, 'not-sure': 50 },
    'relationship': { 'marriage': 80, 'relationship': 100, 'casual': 60, 'friendship': 40, 'not-sure': 70 },
    'casual': { 'marriage': 20, 'relationship': 60, 'casual': 100, 'friendship': 70, 'not-sure': 80 },
    'friendship': { 'marriage': 30, 'relationship': 40, 'casual': 70, 'friendship': 100, 'not-sure': 60 },
    'not-sure': { 'marriage': 50, 'relationship': 70, 'casual': 80, 'friendship': 60, 'not-sure': 90 }
  };

  return goalCompatibility[goal1]?.[goal2] || 50;
}

/**
 * Calculate location compatibility based on distance (0-100)
 */
function calculateLocationScore(
  loc1: User['location'],
  loc2: User['location'],
  maxDistance: number
): number {
  if (!loc1?.coordinates || !loc2?.coordinates) return 70;

  const distance = calculateDistance(
    loc1.coordinates.coordinates[1],
    loc1.coordinates.coordinates[0],
    loc2.coordinates.coordinates[1],
    loc2.coordinates.coordinates[0]
  );

  if (distance > maxDistance) return 0;
  
  // Linear decay: 100 at 0km, decreasing to 50 at maxDistance
  return Math.max(100 - (distance / maxDistance) * 50, 50);
}

/**
 * Calculate age compatibility (0-100)
 */
function calculateAgeScore(
  age1: number,
  age2: number,
  ageRange?: { min: number; max: number }
): number {
  // Check if age2 is within user1's preferred range
  if (ageRange && (age2 < ageRange.min || age2 > ageRange.max)) {
    return 30; // Low but not zero
  }

  // Calculate age difference score
  const ageDiff = Math.abs(age1 - age2);
  
  if (ageDiff <= 2) return 100;
  if (ageDiff <= 5) return 90;
  if (ageDiff <= 10) return 70;
  if (ageDiff <= 15) return 50;
  return 30;
}

/**
 * Calculate lifestyle compatibility (0-100)
 */
function calculateLifestyleScore(user1: User, user2: User): number {
  let score = 50;
  let factors = 0;

  // Smoking compatibility
  if (user1.smoking && user2.smoking) {
    factors++;
    if (user1.smoking === user2.smoking) {
      score += 15;
    } else if (
      (user1.smoking === 'never' && user2.smoking === 'regularly') ||
      (user2.smoking === 'never' && user1.smoking === 'regularly')
    ) {
      score -= 10;
    }
  }

  // Drinking compatibility
  if (user1.drinking && user2.drinking) {
    factors++;
    if (user1.drinking === user2.drinking) {
      score += 15;
    } else if (
      (user1.drinking === 'never' && user2.drinking === 'regularly') ||
      (user2.drinking === 'never' && user1.drinking === 'regularly')
    ) {
      score -= 10;
    }
  }

  // Education level
  if (user1.education && user2.education) {
    factors++;
    // Similar education levels score higher
    score += 10;
  }

  return Math.min(Math.max(score, 0), 100);
}

/**
 * Calculate distance between two coordinates using Haversine formula
 */
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * Generate human-readable reasons for the match
 */
function generateMatchReasons(
  breakdown: MatchScore['breakdown'],
  user1: User,
  user2: User
): string[] {
  const reasons: string[] = [];

  // Interests
  if (breakdown.interests >= 70) {
    const commonInterests = user1.interests.filter(i =>
      user2.interests.some(i2 => i2.toLowerCase() === i.toLowerCase())
    );
    if (commonInterests.length > 0) {
      reasons.push(`You both love ${commonInterests.slice(0, 2).join(' and ')}`);
    }
  }

  // Traits
  if (breakdown.traits >= 70) {
    const commonTraits = user1.traits.filter(t =>
      user2.traits.some(t2 => t2.toLowerCase() === t.toLowerCase())
    );
    if (commonTraits.length > 0) {
      reasons.push(`Similar personalities: ${commonTraits.slice(0, 2).join(', ')}`);
    }
  }

  // Goals
  if (breakdown.goals >= 80) {
    if (user1.relationshipGoal === user2.relationshipGoal) {
      reasons.push(`Both looking for ${user1.relationshipGoal}`);
    }
  }

  // Location
  if (breakdown.location >= 80) {
    reasons.push('Lives nearby');
  }

  // Age
  if (breakdown.age >= 90) {
    reasons.push('Similar age');
  }

  // Lifestyle
  if (breakdown.lifestyle >= 70) {
    const lifestyleMatches: string[] = [];
    if (user1.smoking === user2.smoking) lifestyleMatches.push('lifestyle');
    if (user1.drinking === user2.drinking) lifestyleMatches.push('social habits');
    if (lifestyleMatches.length > 0) {
      reasons.push(`Compatible ${lifestyleMatches.join(' and ')}`);
    }
  }

  // If not many specific reasons, add generic ones based on score
  if (reasons.length === 0) {
    if (breakdown.interests >= 60) reasons.push('Some shared interests');
    if (breakdown.traits >= 60) reasons.push('Complementary personalities');
  }

  return reasons.slice(0, 3); // Limit to top 3 reasons
}

/**
 * Find best matches for a user from a pool of candidates
 */
export function findBestMatches(
  user: User,
  candidates: User[],
  limit: number = 20
): MatchScore[] {
  // Filter candidates based on basic preferences
  const filtered = candidates.filter(candidate => {
    // Skip self
    if (candidate.id === user.id) return false;

    // Check gender preferences
    if (user.preferences?.showMeGender && user.preferences.showMeGender.length > 0) {
      if (!user.preferences.showMeGender.includes(candidate.gender) &&
          !user.preferences.showMeGender.includes('everyone')) {
        return false;
      }
    }

    // Check age range
    if (user.preferences?.ageRange) {
      if (candidate.age < user.preferences.ageRange.min ||
          candidate.age > user.preferences.ageRange.max) {
        return false;
      }
    }

    return true;
  });

  // Calculate match scores
  const matches = filtered.map(candidate => calculateMatchScore(user, candidate));

  // Sort by score and return top matches
  return matches
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

/**
 * Get match quality label based on score
 */
export function getMatchQuality(score: number): string {
  if (score >= 90) return 'Excellent Match';
  if (score >= 80) return 'Great Match';
  if (score >= 70) return 'Good Match';
  if (score >= 60) return 'Decent Match';
  return 'Potential Match';
}

/**
 * Get match color based on score
 */
export function getMatchColor(score: number): string {
  if (score >= 90) return 'text-green-600';
  if (score >= 80) return 'text-blue-600';
  if (score >= 70) return 'text-purple-600';
  if (score >= 60) return 'text-yellow-600';
  return 'text-gray-600';
}
