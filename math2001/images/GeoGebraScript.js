// Button 1
faces = Slider(0, 4, 1, 1, 100, false, true, false, false)
SetVisibleInView(faces, 1, false)
SetVisibleInView(faces, 2, false)

u_1 = (-1, 0, 0)
u_2 = (0, 1, 0)
u_3 = (0, 0, -1)
u_4 = (1; 120°; -20°)
//u_4 = (-1; 45°; 20°)
SetVisibleInView(u_1, -1, false)
SetVisibleInView(u_2, -1, false)
SetVisibleInView(u_3, -1, false)
SetVisibleInView(u_4, -1, false)

vdir = {u_1, u_2, u_3, u_4}
SetVisibleInView(vdir, -1, false)

SelectVec = Element(vdir, faces)
SetVisibleInView(SelectVec, -1, false)

//Button 2
SetValue(faces, faces + 1)
SetViewDirection(SelectVec)
If(faces==4, SetValue(faces, 0))