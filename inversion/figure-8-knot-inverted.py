# === Figure-eight Knot Tube + Inversion ===
# Author: Juan Carlos Ponce Campuzano - 20 March 2025
# Python translation using NumPy + Matplotlib

import numpy as np
import matplotlib.pyplot as plt

# --- Parameters ---
eps = 0.16   # modulation parameter
h = 1.0      # vertical scaling
lamb = 0.25  # interpolation factor
sigma = 1.0  # global scaling
r_tube = 0.25  # tube radius
center = np.array([1.0, 0.0, 0.0])  # offset center

# --- Parameter ranges ---
n_u, n_v = 400, 20
u = np.linspace(0, 2 * np.pi, n_u)
v = np.linspace(0, 2 * np.pi, n_v)
u, v = np.meshgrid(u, v)

# --- Auxiliary functions ---
A = eps * np.sin(4 * u)
v1 = lamb * np.sin(u) - (1 - lamb) * np.sin(3 * u)
v2 = lamb * np.cos(u) + (1 - lamb) * np.cos(3 * u)
v3 = h * np.sin(2 * u)

# --- Figure-eight knot curve ---
scale = sigma * (1 + A) / (1 - A)
x = scale * v1
y = scale * v2
z = scale * v3

# --- Compute Frenet frame numerically ---
du = u[0,1] - u[0,0]

dx_du = np.gradient(x, du, axis=1)
dy_du = np.gradient(y, du, axis=1)
dz_du = np.gradient(z, du, axis=1)

# Tangent vectors
T = np.stack((dx_du, dy_du, dz_du), axis=-1)
T_norm = np.linalg.norm(T, axis=-1, keepdims=True)
T /= (T_norm + 1e-8)

# Derivative of T
dT_du = np.gradient(T, du, axis=1)
N_norm = np.linalg.norm(dT_du, axis=-1, keepdims=True)
N = dT_du / (N_norm + 1e-8)

# Binormal
B = np.cross(T, N)

# --- Tube surface parametrization with center offset ---
cosv = np.cos(v)[..., None]
sinv = np.sin(v)[..., None]
tube = np.stack((x, y, z), axis=-1) + r_tube * (cosv * N + sinv * B) + center

# --- Inversion in unit sphere ---
tube_norm2 = np.sum(tube**2, axis=-1, keepdims=True)
inv = tube / (tube_norm2 + 1e-8)

# --- Plot ---
fig = plt.figure(figsize=(8, 8))
ax = fig.add_subplot(111, projection='3d')
ax.set_proj_type('ortho')  # 🔹 Orthographic projection


ax.plot_surface(
    inv[...,0], inv[...,1], inv[...,2],
    rstride=1, cstride=1,
    color='royalblue',
    edgecolor='k',  
    linewidth=0.1,
    antialiased=False,
    alpha=0.2
)

#ax.plot_wireframe(
#   inv[...,0], inv[...,1], inv[...,2],
#    rstride=3, cstride=3,  # step size for the grid lines
#    color='black',
#    linewidth=0.2
#)

# Labels
ax.set_xlabel("X", fontsize=12)
ax.set_ylabel("Y", fontsize=12)
ax.set_zlabel("Z", fontsize=12)
#ax.set_title("Inverted Figure-eight Knot Tube", fontsize=14, pad=20)

# Optional point label
#ax.text(center[0], center[1], center[2], "O", color='black', fontsize=10)

ax.set_box_aspect([1, 1, 1])
ax.axis('off')
# Change viewpoint
ax.view_init(elev=-40, azim=40)
#ax.view_init(elev=10, azim=20)
plt.show()
