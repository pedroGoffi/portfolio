import { Vector3, LineLoop, BufferGeometry, LineBasicMaterial } from "three";


// Constants
export const GRAVITATIONAL_CONSTANT = 6.67430e-11; // Gravitational constant (m^3 kg^-1 s^-2)
export const SUN_MASS = 1.989e30;    // Mass of the Sun (kg)
export const EARTH_MASS = 5.972e24;  // Mass of the Earth (kg)
export const MOON_MASS = 7.348e22;   // Mass of the Moon (kg)
export const ASTRONOMICAL_UNIT = 1.496e11;   // Astronomical Unit (meters)

// Orbital parameters for Earth, Moon, and Sun

// Earth parameters
export const EARTH_SEMI_MAJOR_AXIS = 149.6e9;  // Semi-major axis for Earth (in meters)
export const EARTH_ECCENTRICITY = 0.0167;     // Eccentricity for Earth
export const EARTH_ORBITAL_PERIOD = 365.25 * 24 * 60 * 60; // Orbital period for Earth in seconds

// Moon parameters (relative to Earth)
export const MOON_SEMI_MAJOR_AXIS = 384.4e3;  // Semi-major axis for Moon (in meters)
export const MOON_ECCENTRICITY = 0.0549;      // Eccentricity for Moon
export const MOON_ORBITAL_PERIOD = 27.322 * 24 * 60 * 60; // Orbital period for Moon in seconds

// Utility functions

// Calculates the distance between two masses (for gravity calculations)
const calculateDistance = (position1: Vector3, position2: Vector3): number => {
    return position1.distanceTo(position2);
};
const calculateOrbitDistance = (semiMajorAxis: number, eccentricity: number, trueAnomaly: number) => {
    // Elliptical orbit formula (from Kepler's laws)
    return (semiMajorAxis * (1 - eccentricity ** 2)) / (1 + eccentricity * Math.cos(trueAnomaly));
  };
// Calculates the gravitational force between two bodies
const calculateGravitationalForce = (mass1: number, mass2: number, distance: number): number => {
    return (GRAVITATIONAL_CONSTANT * mass1 * mass2) / (distance ** 2);
};

// Calculates the position of the planet (given orbital parameters).
export const calculatePositionInOrbit = (semiMajorAxis: number, eccentricity: number, trueAnomaly: number): Vector3 => {
    const distance = calculateOrbitDistance(semiMajorAxis, eccentricity, trueAnomaly);     
    const x = distance * Math.cos(trueAnomaly);
    const y = distance * Math.sin(trueAnomaly);
    const z = 0; // For simplicity, we assume the orbit is in the X-Y plane (Z = 0)
    return new Vector3(x, y, z);  // Return the position as a Vector3
}

// Function that simulates the orbit for a planet given its parameters and time, including gravity effect
export const simulatePlanetOrbitWithGravity = (
    mass1: number, 
    mass2: number, 
    semiMajorAxis: number, 
    eccentricity: number, 
    orbitalPeriod: number, 
    time: number, 
    velocity: Vector3
): Vector3 => {
    const angularVelocity = 2 * Math.PI / orbitalPeriod;  // Angular velocity in radians per second
    const trueAnomaly = angularVelocity * time;  // True anomaly based on time

    // Calculate positions of the two bodies
    const position1 = calculatePositionInOrbit(semiMajorAxis, eccentricity, trueAnomaly);
    const position2 = new Vector3(0, 0, 0);  // Assuming Sun is at the origin

    // Calculate the distance between the two bodies (i.e., Earth and Sun)
    const distance = calculateDistance(position1, position2);

    // Calculate the gravitational force between the Earth and Sun
    const force = calculateGravitationalForce(mass1, mass2, distance);

    // Calculate gravitational acceleration (Force = mass * acceleration => acceleration = Force / mass)
    const acceleration = force / mass1;

    // Calculate the direction of the force (towards the Sun)
    const direction = position2.clone().sub(position1).normalize();

    // Update velocity based on acceleration (assuming small time steps for simplicity)
    velocity.add(direction.multiplyScalar(acceleration));

    // Update position based on velocity (simple Euler integration)
    position1.add(velocity);

    return position1;  // Return the updated position of the Earth (or planet)
}

// Function to simulate Earth's orbit with gravity
export const simulateEarthOrbit = (time: number, velocity: Vector3): Vector3 => {
    return simulatePlanetOrbitWithGravity(SUN_MASS, EARTH_MASS, EARTH_SEMI_MAJOR_AXIS, EARTH_ECCENTRICITY, EARTH_ORBITAL_PERIOD, time, velocity);
}

// Function to simulate Moon's orbit with gravity (relative to Earth)
export const simulateMoonOrbit = (time: number, velocity: Vector3): Vector3 => {
    return simulatePlanetOrbitWithGravity(EARTH_MASS, MOON_MASS, MOON_SEMI_MAJOR_AXIS, MOON_ECCENTRICITY, MOON_ORBITAL_PERIOD, time, velocity);
}

// Function to create Earth's orbit path (ellipse)
export const createOrbitPath = (semiMajorAxis: number, eccentricity: number): LineLoop => {
    // Create an array to store the points of the orbit
    const points: Vector3[] = [];
    const numberOfPoints = 360; // Number of points to approximate the ellipse
    
    // Calculate the points along the orbit
    for (let i = 0; i < numberOfPoints; i++) {
      const angle = (i / numberOfPoints) * Math.PI * 2;  // Angle in radians
      const distance = calculateOrbitDistance(semiMajorAxis, eccentricity, angle);
      
      // Convert polar to Cartesian coordinates (ellipse)
      const x = distance * Math.cos(angle);
      const y = distance * Math.sin(angle);
      
      // Add the calculated point to the orbit points array
      points.push(new Vector3(x, y, 0));  // We assume the orbit lies in the X-Y plane
    }
  
    // Create a geometry using the points
    const geometry = new BufferGeometry().setFromPoints(points);
  
    // Material for the orbit path
    const material = new LineBasicMaterial({
      color: 0x00ff00, // Green color for the orbit line
      opacity: 0.3,    // Slightly transparent
      transparent: true
    });
  
    // Create the LineLoop to connect the points and form a closed path
    const orbitPath = new LineLoop(geometry, material);
  
    return orbitPath;
  };