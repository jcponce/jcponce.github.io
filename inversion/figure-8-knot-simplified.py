import numpy as np
import matplotlib.pyplot as plt
from mpl_toolkits.mplot3d import Axes3D

# === Parameters ===
h = 1.0
eps = 0.16

# Inversion sphere
center = np.array([-1.5, 0.0, 0.0])  # center of inversion sphere
R = 1                              # radius of inversion sphere

# === Parameter grid ===
u = np.linspace(0, 2 * np.pi, 1500)
v = np.linspace(0, 2 * np.pi, 30)
u, v = np.meshgrid(u, v)

# === Helper factor ===
denominator = eps * np.sin(4*u) - 1
mask = np.abs(denominator) < 0.02
denominator[mask] = np.nan
factor = (eps * np.sin(4*u) + 1) / denominator

# === Parametric equations ===
x = np.sin(3*u) * (1.5 + 0.25 * np.sin(v)) * factor
y = np.cos(3*u) * (1.5 + 0.25 * np.sin(v)) * factor
z = 0.333 * np.cos(v) - h * np.sin(2*u) * factor

# Mask invalid points
x[mask] = np.nan
y[mask] = np.nan
z[mask] = np.nan

# === Inversion ===
X = x - center[0]
Y = y - center[1]
Z = z - center[2]

r2 = X**2 + Y**2 + Z**2
# avoid division by zero
r2[r2 == 0] = np.nan

x_inv = center[0] + (R**2 * X) / r2
y_inv = center[1] + (R**2 * Y) / r2
z_inv = center[2] + (R**2 * Z) / r2

# === Plot ===
fig = plt.figure(figsize=(9, 7))
ax = fig.add_subplot(111, projection='3d')
ax.set_proj_type('ortho')

# Original surface (light gray)
#ax.plot_surface(
#    x, y, z,
#    rstride=1, cstride=1,
#    color='#d9d9d9',
#    linewidth=0.1,
#    edgecolor='k',
#    alpha=0.5
#)

# Inverted surface (blue tone)
ax.plot_surface(
    x_inv, y_inv, z_inv,
    rstride=1, cstride=1,
    color='#4f83cc',
    #color='#f2f2f2',
    linewidth=0.1,
    edgecolor='k',
    alpha=0.2
)

# === Labels, title, aspect ===
ax.set_xlabel('X', fontsize=12)
ax.set_ylabel('Y', fontsize=12)
ax.set_zlabel('Z', fontsize=12)
#ax.set_title(r"Inversion of Reduced Figure-Eight Knot Surface", fontsize=14)

ax.axis('off')
ax.set_box_aspect([1, 1, 1])
ax.view_init(elev=-20, azim=-20)
#ax.view_init(elev=90, azim=90)


plt.tight_layout()
plt.show()
