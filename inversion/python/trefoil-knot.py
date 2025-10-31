# Author: Juan Carlos Ponce Campuzano
# Trefoil surface with inversion

import numpy as np
import matplotlib.pyplot as plt
from mpl_toolkits.mplot3d import Axes3D

# --- Parameters ---
sigma = 0.12     # overall size of the knot
center = np.array([-0.71, 0.0, 0.0])  # translation of original surface
u_res, v_res = 800, 100      # mesh resolution

# --- Parameter grids ---
u_vals = np.linspace(0, 4 * np.pi, u_res)
v_vals = np.linspace(0, 2 * np.pi, v_res)
U, V = np.meshgrid(u_vals, v_vals)

# --- Trefoil surface parametrization ---
X = -sigma * (np.cos(U) * np.cos(V) + 3 * np.cos(U) * (1.5 + np.sin(1.5 * U) / 2)) + center[0]
Y =  sigma * (np.sin(U) * np.cos(V) + 3 * np.sin(U) * (1.5 + np.sin(1.5 * U) / 2)) + center[1]
Z =  sigma * (np.sin(V) + 2 * np.cos(1.5 * U)) + center[2]

# --- Inversion transformation ---
R2 = X**2 + Y**2 + Z**2
X_inv = X / R2
Y_inv = Y / R2
Z_inv = Z / R2

# --- Plot surfaces ---
fig = plt.figure(figsize=(10, 10))
ax = fig.add_subplot(111, projection='3d')
ax.set_proj_type('ortho')

# Original trefoil surface (optional)
# ax.plot_surface(
#     X, Y, Z,
#     rstride=1, cstride=1,
#     color='royalblue',
#     linewidth=0.2,
#     edgecolor='gray',
#     alpha=0.5
# )

# Inverted trefoil surface
ax.plot_surface(
    X_inv, Y_inv, Z_inv,
    rstride=1, cstride=1,
    color='#f2f2f2',
    linewidth=0.1,
    edgecolor='k',
    alpha=0.2
)

# --- Labels and view ---
ax.set_xlabel("X", labelpad=10)
ax.set_ylabel("Y", labelpad=10)
ax.set_zlabel("Z", labelpad=10)
ax.set_box_aspect([1, 1, 1])
ax.view_init(elev=-10, azim=40)
ax.axis('off')

plt.show()
