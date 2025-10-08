# === Figure-eight Knot Tube ===
# Author: Juan Carlos Ponce Campuzano - Improved Frenet Frame
# Python translation by ChatGPT

import numpy as np
import matplotlib.pyplot as plt
from mpl_toolkits.mplot3d import Axes3D

# --- Parameters ---
eps    = 0.16     # modulation parameter
h      = 1        # vertical scaling
lamb   = 0.25     # interpolation factor
sigma  = 1        # global scaling
r_tube = 1/4      # tube radius

# --- Auxiliary functions ---
def A(x):
    return eps * np.sin(4 * x)

def v1(x):
    return lamb * np.sin(x) - (1 - lamb) * np.sin(3 * x)

def v2(x):
    return lamb * np.cos(x) + (1 - lamb) * np.cos(3 * x)

def v3(x):
    return h * np.sin(2 * x)

# --- Figure-eight knot curve ---
def knot_curve(x):
    scale = sigma * (1 + A(x)) / (1 - A(x))
    return np.array([
        scale * v1(x),
        scale * v2(x),
        scale * v3(x)
    ])

# --- Improved Frenet Frame (robust) ---
def frenet_frame(u):
    du = 1e-4
    r1 = knot_curve(u - du)
    r2 = knot_curve(u)
    r3 = knot_curve(u + du)

    # First derivative (velocity)
    rp = (r3 - r1) / (2 * du)
    T = rp / np.linalg.norm(rp)

    # Second derivative (acceleration)
    rpp = (r3 - 2 * r2 + r1) / (du ** 2)

    # Normal vector
    N = rpp - np.dot(rpp, T) * T
    N = N / (np.linalg.norm(N) + 1e-12)

    # Binormal vector
    B = np.cross(T, N)
    B = B / np.linalg.norm(B)

    return r2, T, N, B

# --- Tube surface parametrization ---
def tube_surface(u, v):
    r, T, N, B = frenet_frame(u)
    return r + r_tube * (np.cos(v) * N + np.sin(v) * B)

# --- Mesh grid ---
u_vals = np.linspace(0, 2 * np.pi, 250)
v_vals = np.linspace(0, 2 * np.pi, 60)
U, V = np.meshgrid(u_vals, v_vals)
X = np.zeros_like(U)
Y = np.zeros_like(U)
Z = np.zeros_like(U)

# --- Evaluate surface points ---
for i in range(U.shape[0]):
    for j in range(U.shape[1]):
        p = tube_surface(U[i, j], V[i, j])
        X[i, j], Y[i, j], Z[i, j] = p

# --- Plot ---
fig = plt.figure(figsize=(8, 8))
ax = fig.add_subplot(111, projection='3d')
ax.set_proj_type('ortho')  # Orthographic projection ✅

ax.plot_surface(
    X, Y, Z,
    rstride=1, cstride=1,
    color='#f2f2f2',
    linewidth=0.1,
    edgecolor='k',
    alpha=1.0
)

# Labels, aspect, and viewpoint
ax.set_xlabel("X", labelpad=10)
ax.set_ylabel("Y", labelpad=10)
ax.set_zlabel("Z", labelpad=10)
ax.set_box_aspect([1, 1, 1])
ax.view_init(elev=10, azim=45)
ax.axis('on')

plt.tight_layout()
plt.show()
