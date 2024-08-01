/**
 * Lorenz Attractor modified
 */
const initialParams = {
    Attractor: "Lorenz modified",
    sigma: 10,
    rho: 28,
    beta: 8 / 3,
};

const params = { ...initialParams };

let lorenzAttractorModified = (x, y, z) => {
    const { sigma, rho, beta } = params;
 
    const dx = (sigma * (y - x) + (sin(y / 5) * sin(z / 5) * 200)) * .65;
    const dy = (x * (rho - z) - y + (sin(x / 5) * sin(z / 5) * 200)) * .65;
    const dz = (x * y - beta * z + cos(y / 5) * cos(x / 5) * 200) * .65;

    return { dx, dy, dz };
};