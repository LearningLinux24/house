# 3D Architectural Specification: First Floor Plan

> Companion to `ground_floor_3d_simulation_specification.md`. Same origin, same axes, same Z datum, same tags, same top-level section structure (0 to 14). A builder that has the ground floor spec can stack this floor on it without any offset.

## 0. How to read this document

Every number is tagged with where it came from. The 3D builder must treat them differently.

| Tag | Meaning | Reliability |
| :--- | :--- | :--- |
| **[P]** | Written on the plan as a dimension label (e.g. 13'-7.5", 3'-3", 9'-0") | Exact |
| **[D]** | Derived by arithmetic from [P] values, or inherited from the ground floor spec where the two floors stack (wall-chain sums, wall positions that follow from room sizes) | Exact, as long as the [P] values are right |
| **[M]** | Measured off the photographed plan (about 45 px per ft; the photo is skewed, with a vertical scale that drifts from about 47 px/ft on the west to about 44 px/ft on the east) | +/- 0.25 ft on clean features, +/- 0.5 ft otherwise |
| **[A]** | Assumption. NOT on the plan (all Z heights, wall thicknesses, stair counts, door heads, fixture heights, etc.) | Replaceable. Listed in section 12 |

Coordinates are internally consistent to 0.001 ft because they are sums of labelled dimensions. That is not survey accuracy. Anything tagged [M] or [A] is only as good as its tag says.

**Two thick black lines on the first-floor images were drawn by the plan's owner**, not by the original draughtsman (one thin line across the west end of the master bedroom's south wall, one heavy bar closing the kitchen's south wall). They are present in both the original and the modified image. They are treated as **walls** and tagged [M] (see 5.2 and section 10).

**Reading order of evidence used for this floor:** the dimension labels (`first-floor`), what survived in the wall-only image (`firstfloor-modified`, where dimension lines are blurred out), and the ground floor spec for everything that stacks.

---

## 1. Target LLM Prompt Header

> **System Instruction for 3D Builder LLM:** Build a 3D model of the **first floor of a two-storey residential building** (the ground floor is specified separately; a second flight of stairs leads up to a flat terrace that is not drawn) using only the coordinates, elevations (Z), wall segments and openings in this document. Do **not** add partitions, windows, door leaves, furniture, railings or any element not listed here. The only fixtures are the four boxes in section 9. Every opening is a bare gap in a wall. Units are feet. Where two wall boxes overlap at a corner, union them. Use the parameters in section 2 so that assumptions can be changed in one place.

> **Section 14 is review commentary for the human reader. Do not act on it: build exactly what sections 4 to 9 specify, even where section 14 questions a design choice. Options (7.7, 7.8) are OFF unless the human says otherwise.**

---

## 2. Global Parameters

| Parameter | Value | Tag | Note |
| :--- | :--- | :--- | :--- |
| `T_INT` interior wall thickness | 0.375 ft (4.5") | [D] | Same as the ground floor. All first-floor dimension chains close exactly with 0.375 (3.1) |
| `T_EXT` exterior wall thickness | 0.75 ft (9") | [A] | Same convention as the ground floor |
| `Z_F1` first-floor finished level | +12.00 | [D] | = `Z_UPPER` of the ground floor spec = top of the ground slab |
| `Z_CEIL1` underside of the roof slab | +22.00 | [A] | 10.00 ft clear above `Z_F1`, same clear height as the ground floor |
| `T_SLAB` slab thickness | 0.50 | [A] | Roof slab occupies Z in [22.00, 22.50]; floor plate occupies [11.50, 12.00] |
| `Z_TERRACE` terrace level | +22.50 | [A] | Top of the roof slab. The upper flight climbs to this level |
| `H_DOOR` head height of interior openings | 7.00 | [A] | Measured from the floor, so the head is at Z = 19.00. Wall above is solid up to the slab |
| Exterior wall top | = `Z_CEIL1` | [A] | Includes the balcony's outer walls (height unknown, see section 12, item 3) |
| `H_PLATFORM`, `H_BASIN`, `H_WM` fixture heights | 2.75, 2.75, 3.00 | [A] | Kitchen platform, hallway basin counter, washing machine. Section 9 |
| Stair riser / run (upper flight) | 0.75 / 0.77 | [A] | 14 risers climbing 10.50 ft; run copies the ground flight |

---

## 3. Coordinate System

* **Origin (0, 0, 0)**: inner south-west corner of the plot boundary at street level. **Identical to the ground floor spec.**
* **+X = East (right on the plan).** Internal span 0 to 49.25 ft. Outer face of the east wall at X = 50.00.
* **+Y = North (top of the plan).** Internal span 0 to 23.25 ft. Outer face of the north wall at Y = 24.00. South wall occupies Y = -0.75 to 0.
* **+Z = up.** This floor's floor is at Z = 12.00.
* Plan north is assumed to be the top of the sheet [A], as on the ground floor. The title "First Floor" is typed at the *bottom* of the photo and some handwriting is upside-down, probably because the sheet was turned while it was being annotated. The drawing itself has the same orientation as the ground floor (stairs on the right, master bedroom top-left).
* **The first floor covers the full plot width.** Unlike the ground floor (house wall at X = 3.25, garden to the west), the first-floor west wall stands at X = -0.75 to 0 and the floor projects over the garden and the gate landing (see 7.6).

### 3.1 Dimension-chain checks (all [P] -> [D])

East-West (X), four independent chains, each closing on the same total:

* **West-to-east spine:** Master bedroom / kitchen block 14.000 (= master bedroom 13.625 [P] + wall 0.375) + Lobby 12.000 [P] = 26.000; + wall 0.375 = 26.375; + Stairs bay 7.500 [D from ground floor] = 33.875; + wall 0.375 = 34.250; + Hallway 5.625 [P: 5'7.5"] = 39.875; + wall 0.375 = 40.250; + Child bedroom / Mandir 9.000 [P] = **49.250**
* **Kitchen block:** Balcony 3.250 [P] + wall 0.375 + Kitchen 10.000 [P] + wall 0.375 = 14.000 (equals the master bedroom 13.625 + 0.375)
* **North wet row:** 14.000 + Basin niche 3.250 [P] + wall 0.375 + Bathroom 1 9.000 [P] + wall 0.375 = 27.000; + Shaft alcove 5.500 [D] = 32.500; + wall 0.375 + Bathroom 2 7.000 [P] + wall 0.375 = **40.250** (the same line as the hallway/child-bedroom wall)
* The alcove width 5.500 is derived (40.250 - 0.375 - 7.000 - 0.375 - 27.000). It is **not** labelled. Measured alcove width is 5.2 to 5.6 [M], and the ground-floor shaft (X = 28 to 32) sits inside it with margins 1.0 W and 0.5 E, as on the plan.

North-South (Y), three independent bays, each totals 23.25 ft:

* West bay: South balcony 4.000 [P] + wall 0.375 + Kitchen 7.000 [P] + wall 0.375 + Master bedroom 11.500 [P] = 23.25
* Central bay: Lobby 18.875 [P: 18'10.5"] + wall 0.375 + Bathroom 1 / Basin niche 4.000 [P] = 23.25
* East bay: Mandir 9.000 [P] + wall 0.375 + Child bedroom 13.875 [D] = 23.25

### 3.2 Alignment with the ground floor (what stands on what)

| First-floor element | Ground-floor element it stacks on | Verdict |
| :--- | :--- | :--- |
| F-INT-03 kitchen west wall, X = 3.25 to 3.625 | W-INT-01 (X = 3.25 to 3.625, Y 7.5 to 23.25) | Exact in X; Y = 4.375 to 7.5 sits over the porch (rests on the slab) |
| F-INT-05 lobby west wall, X = 13.625 to 14.0 | W-INT-05 (X = 13.625 to 14.0, Y 4.375 to 15.0) | Exact for Y = 4.375 to 8.375 |
| F-INT-02 line Y = 11.375 to 11.75 | W-INT-07 (same Y band, X 14 to 26) | Same Y line, different X range |
| F-INT-09 stair west wall, X = 26.0 to 26.375 | W-INT-08 (Y 4.375 to 15.0) | Exact in X and Y over Y = 4.375 to 15.0 |
| F-INT-10 stair east wall, X = 33.875 to 34.25 | W-INT-10a (Y 0 to 15.0) | Exact |
| F-INT-07, F-INT-12 wet-row south walls, Y = 18.875 to 19.25 | W-INT-03 / W-INT-11 (same Y band) | Same Y line, different X ranges |
| Shaft box X = 28 to 32, Y = 19.5 to 22.5 | Ground shaft Z10 | Identical in plan: one shaft through both floors |
| Hallway east boundary X = 39.875 | none (ground has garage / East washroom there) | No stacking; rests on the slab |

Everything else on this floor rests on the floor plate (section 8).

---

## 4. Rooms and Zones (clear interior floor areas)

Each zone's floor is the floor plate top at **Z = 12.00** (section 8). Zones tile the interior with the wall boxes (see the grid check, 13.9).

| Zone | Label | X min | X max | Y min | Y max | Clear size | Floor Z | Above | Basis |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| F1 | South balcony | 0.000 | 13.625 | 0.000 | 4.000 | 13'7.5" x 4'0" | 12.00 | Roof slab | [P]/[D] |
| F2 | West balcony | 0.000 | 3.250 | 4.000 | 11.375 | 3'3" x 7'4.5" | 12.00 | Roof slab | [P]/[D] |
| F3 | Kitchen | 3.625 | 13.625 | 4.375 | 11.375 | 10'0" x 7'0" | 12.00 | Roof slab | [P] |
| F4 | Master bedroom | 0.000 | 13.625 | 11.750 | 23.250 | 13'7.5" x 11'6" | 12.00 | Roof slab | [P] |
| F5 | Basin niche | 14.000 | 17.250 | 18.875 | 23.250 | 3'3" x 4'4.5" | 12.00 | Roof slab | [P]/[D] |
| F6 | Bathroom 1 | 17.625 | 26.625 | 19.250 | 23.250 | 9'0" x 4'0" | 12.00 | Roof slab | [P] |
| F7 | Lobby | 14.000 | 26.000 | 0.000 | 18.875 | 12'0" x 18'10.5" | 12.00 | Roof slab | [P] |
| F8 | Stairs bay | 26.375 | 33.875 | 0.000 | 15.000 | 7'6" x 15'0" | 12.00, flight per 7.1, void per 7.2 | Roof slab with cut-out (7.3) | [D]/[M] |
| F9 | North gallery (above the stairs) | 26.000 | 34.250 | 15.000 | 18.875 | 8'3" x 3'10.5" | 12.00 | Roof slab | [D] |
| F10 | Shaft alcove | 27.000 | 32.500 | 18.875 | 23.250 | 5'6" x 4'4.5" | 12.00 | Roof slab | [D] |
| F11 | Bathroom 2 | 32.875 | 39.875 | 19.250 | 23.250 | 7'0" x 4'0" | 12.00 | Roof slab | [P] |
| F12 | Hallway | 34.250 | 39.875 | 0.000 | 18.875 | 5'7.5" x 18'10.5" | 12.00 | Roof slab | [P]/[D] |
| F13 | Child bedroom | 40.250 | 49.250 | 9.375 | 23.250 | 9'0" x 13'10.5" | 12.00 | Roof slab | [P]/[D] |
| F14 | Mandir | 40.250 | 49.250 | 0.000 | 9.000 | 9'0" x 9'0" | 12.00 | Roof slab | [P] |

Notes:

* **Door strips belong to a zone** (the permitted double count with the lintel, see 13.9): master-bedroom door strip (X 13.625 to 14.0, Y 11.75 to 15.0) and kitchen door strip (X 13.625 to 14.0, Y 8.375 to 11.375) belong to **F7 Lobby**; Bathroom 1 door strip (X 17.625 to 20.125, Y 18.875 to 19.25) belongs to **F6**; Bathroom 2 door strip (X 37.125 to 39.875, Y 18.875 to 19.25) belongs to **F11**; child-bedroom door strip (X 39.875 to 40.25, Y 9.375 to 12.875) belongs to **F13**; mandir door strip (X 39.875 to 40.25, Y 6.5 to 9.0) belongs to **F14**.
* **F1 and F2 are one L-shaped balcony.** They are open to each other along Y = 4.0 (X = 0 to 3.25). Together 78.47 sq ft.
* **F5 (basin niche)** is open to the lobby along its whole south side (Y = 18.875, X = 14.0 to 17.25). Its clear depth is 4'0" to the thin line drawn at Y = 19.25 (a 4.0 ft depth matches the two bathrooms) and 4'4.5" to the lobby face. The floor is continuous, so F5 is built to Y = 18.875. See 10, item 5.
* **F8** is one zone, but its floor is not uniform: lane A is solid stair blocks (7.1), lane B has a void between Y = 7.0 and 13.25 (7.2), the south 4.0 ft is an enclosed pocket (7.4).
* **F9** is the open space north of the stairs: it joins the lobby (west), the hallway (east), the shaft alcove (north) and the stair landing (south). The first-floor stair walls stop at Y = 15.0, so nothing separates F9 from these.
* **F12 and F9** meet along X = 34.25 for Y = 15.0 to 18.875 with no wall: the hallway flows into the gallery.
* **F13 and F14** share a wall (F-INT-14) and both open west to the hallway through doors in the same wall line (X = 39.875 to 40.25).

---

## 5. Wall Registry (bounding boxes `[Xmin, Xmax, Ymin, Ymax]`)

### 5.1 Exterior walls (`T_EXT`, Z from 12.00 to `Z_CEIL1`)

| ID | Box | Notes |
| :--- | :--- | :--- |
| F-EXT-NORTH | [-0.750, 50.000, 23.250, 24.000] | Continuous. |
| F-EXT-EAST | [49.250, 50.000, 0.000, 23.250] | Continuous. |
| F-EXT-WEST | [-0.750, 0.000, 0.000, 23.250] | **Continuous from Y = 0 to 23.25.** There is **no gate** on this floor: the plan draws the outer wall unbroken. It stands over the ground-floor pedestrian gate (Y = 0 to 7.5), so it rests on the cantilever plate ES-W (8). Y = 0 to 11.75 is the balcony's outer wall (section 12, item 3). |
| F-EXT-SOUTH | [-0.750, 50.000, -0.750, 0.000] | **Continuous from X = -0.75 to 50.0.** It stands over the ground-floor garage gate (X = 36.5 to 49.25), so it rests on the edge strip ES-S (8). X = -0.75 to 14.0 is the balcony's outer wall. |

### 5.2 Interior walls (`T_INT`)

**All interior walls run from Z = 12.00 to `Z_CEIL1` (22.00)** and stand on the floor plate. Every wall footprint lies on a floor-plate box (checked in 13.9).

| ID | Box | Openings / notes |
| :--- | :--- | :--- |
| F-INT-01 | [13.625, 14.000, 15.000, 23.250] | Master bedroom east wall (also the basin niche west wall). Solid. Ends at Y = 15.0 [M]. **Master bedroom door**: Y = 11.75 to 15.0 (3.25 ft) at X = 13.625 to 14.0. |
| F-INT-02 | [0.000, 14.000, 11.375, 11.750] | Master bedroom south wall / kitchen north wall, full length from the west exterior wall to X = 14.0. Solid. **X = 0 to 3.25 is the owner's thin black line** (the balcony's north wall) [M]; its thickness is assumed equal to the rest of the wall. |
| F-INT-03 | [3.250, 3.625, 4.375, 11.375] | Kitchen west wall (the balcony's east wall). Solid. |
| F-INT-04 | [3.250, 13.625, 4.000, 4.375] | Kitchen south wall (the south balcony's north wall). Solid, no opening. **X = 10.4 to 13.625 is the owner's heavy black bar** [M]; the original sketch ended this wall near X = 10.9 and left the south-east corner of the kitchen open. Option C (7.7) reopens it. |
| F-INT-05 | [13.625, 14.000, 0.000, 8.375] | Lobby west wall (south balcony east wall, kitchen east wall). Solid from Y = 0 to 8.375, **with no door** [M]. **Kitchen door**: Y = 8.375 to 11.375 (3.00 ft) at X = 13.625 to 14.0. |
| F-INT-06 | [17.250, 17.625, 18.875, 23.250] | Basin niche east wall / Bathroom 1 west wall. Solid. Runs to Y = 18.875, level with the south face of the bathroom walls. |
| F-INT-07 | [20.125, 27.000, 18.875, 19.250] | Bathroom 1 south wall. Starts at X = 20.125. **Bathroom 1 door**: X = 17.625 to 20.125 (2.50 ft). |
| F-INT-08 | [26.625, 27.000, 19.250, 23.250] | Bathroom 1 east wall / shaft alcove west wall. Solid. |
| F-INT-09 | [26.000, 26.375, 0.000, 15.000] | Stairs bay west wall / lobby east wall. Solid for its whole length. Ends at Y = 15.0, so the lobby opens into the north gallery for Y = 15.0 to 18.875. |
| F-INT-10 | [33.875, 34.250, 0.000, 15.000] | Stairs bay east wall / hallway west wall. Solid. Ends at Y = 15.0. |
| F-INT-11 | [32.500, 32.875, 19.250, 23.250] | Bathroom 2 west wall / shaft alcove east wall. Solid. |
| F-INT-12 | [32.500, 37.125, 18.875, 19.250] | Bathroom 2 south wall. Ends at X = 37.125 [M]. **Bathroom 2 door**: X = 37.125 to 39.875 (2.75 ft). |
| F-INT-13 | [39.875, 40.250, 12.875, 23.250] | Hallway / child bedroom wall and Bathroom 2 east wall. Solid from Y = 12.875 to 23.25. **Child-bedroom door**: Y = 9.375 to 12.875 (3.50 ft) at X = 39.875 to 40.25. |
| F-INT-14 | [39.875, 49.250, 9.000, 9.375] | Mandir north wall / child bedroom south wall. Solid. |
| F-INT-15 | [39.875, 40.250, 0.000, 6.500] | Mandir west wall. Solid from Y = 0 to 6.5. **Mandir door**: Y = 6.5 to 9.0 (2.50 ft) at X = 39.875 to 40.25. |

No other walls exist. In particular there is **no** wall closing the basin niche on its south side (10, item 5), **no** spine wall between the two stair flights (7.1), **no** wall around the shaft (7.5), **no** wall across the stairs bay at Y = 4.0, and **no** wall between the north gallery and the lobby, hallway or shaft alcove.

---

## 6. Openings Summary (for validation)

All interior openings are bare, with head at `H_DOOR` (7.00 ft, Z = 19.00) and solid wall above, unless marked "full".

| Opening | Plane | Span | Width |
| :--- | :--- | :--- | :--- |
| Master bedroom door | X = 13.625 to 14.0 | Y = 11.75 to 15.0 | 3.25 ft [M] |
| Kitchen door | X = 13.625 to 14.0 | Y = 8.375 to 11.375 | 3.00 ft [M] |
| Bathroom 1 door | Y = 18.875 to 19.25 | X = 17.625 to 20.125 | 2.50 ft [M] |
| Basin niche to lobby | Y = 18.875 | X = 14.0 to 17.25 | 3.25 ft, full (no head, no wall) |
| Lobby to north gallery | X = 26.0 | Y = 15.0 to 18.875 | 3.875 ft, full |
| Stairs bay to north gallery | Y = 15.0 | X = 26.375 to 33.875 | 7.50 ft, full |
| North gallery to shaft alcove | Y = 18.875 | X = 27.0 to 32.5 | 5.50 ft, full |
| North gallery to hallway | X = 34.25 | Y = 15.0 to 18.875 | 3.875 ft, full |
| Bathroom 2 door | Y = 18.875 to 19.25 | X = 37.125 to 39.875 | 2.75 ft [M] |
| Child bedroom door | X = 39.875 to 40.25 | Y = 9.375 to 12.875 | 3.50 ft [M] |
| Mandir door | X = 39.875 to 40.25 | Y = 6.5 to 9.0 | 2.50 ft [M] |
| Balcony | **none** | | **No opening to the balcony is drawn.** Option C (7.7) |
| Gates | none on this floor | | Exterior walls are unbroken |

---

## 7. Vertical Circulation and Level Changes

### 7.1 Upper flight, first floor to terrace (lane A of Zone F8) [M] geometry, [A] counts

* The plan shows **two parallel flights** side by side in the stairs bay (X = 26.375 to 33.875, Y = 4.0 to 14.0 [M]), separated by a narrow strip. The **east flight (lane B, X = 30.125 to 33.875) is the ground-floor flight** (ground spec 7.2, treads T01 to T12) seen from above; it is not rebuilt here. The **west flight (lane A) is the flight from this floor to the terrace**, and it is the only stair solid built in this file.
* **Lane A:** X = **26.375 to 29.625** (3'3" [M], measured 3.3 to 3.5). **Well (gap):** X = **29.625 to 30.125** (0.50 ft [M], measured about 0.55). The strip between the flights is drawn wider than a wall line (0.38 ft), so it is treated as an **open well, not a spine wall**. Its floor is the floor plate; no railing is modelled. **Lane B:** X = 30.125 to 33.875 (3.75 ft, matches the ground flight).
* **Direction [A]:** lane A **ascends south**. The two flights meet at the north end: the ground flight arrives at the first floor at Y = 13.24 (lane B), and lane A's first tread starts about one tread further north (Y = 14.01 [M]: the plan shows lane A's top edge one tread above lane B's). This is the usual turn at the floor level of a two-flight stair. The south end of lane A (Y = 4.0) is level with the south end of lane B on the plan.
* **Rise [A]:** 14 equal risers of (22.50 - 12.00) / 14 = **0.750 ft** (9.0") from Z = +12.00 to the terrace level `Z_TERRACE` = +22.50. **Run:** 0.77 ft (9.24"), the same as the ground flight.
* **Counts [A]:** 13 treads. The plan shows lane A with 12 tread intervals and lane B with 11, but the ground spec has 12 treads in lane B, so the plan's counts are +/- 1. Lane A is one tread longer than lane B on the plan, hence 13. If the owner's real count differs, keep the extent Y = 4.0 to 14.01 and recompute run and riser.
* Tread k (k = 1 to 13) covers Y = 14.01 - 0.77k to 14.01 - 0.77(k - 1), top Z = 12.00 + 0.75k. The 14th riser is at Y = 4.0, up to the roof-slab top (Z = 22.50).
* Build each tread as a solid block from Z = 12.00 up to its top (solid RCC-style flight, as in the ground spec).
* Floor north of tread 1 (Y = 14.01 to 15.0, X = 26.375 to 29.625) is the floor plate at Z = 12.00.

### 7.2 Stairwell void over the ground flight (lane B) [A]

* The floor plate has an opening X = 30.125 to 33.875, **Y = 7.00 to 13.25** (ground spec 7.3: boxes SL3 and SL4). It is the same hole, seen from above. Nothing is built in it on this floor. The ground flight's treads T05 to T12 are visible below it.
* The floor is continuous over Y = 0 to 7.0 (SL3) and over Y = 13.25 to 24.0 (SL4). The strip Y = 13.25 to 15.0 on lane B is where the ground flight's passengers step onto this floor.
* Do not add a railing around the void. The plan shows none.

### 7.3 Roof-slab cut-out over lane A [A]

* Opening in the roof slab: X = 26.375 to 29.625, **Y = 4.00 to 11.00**. With a 6.75 ft headroom rule, tread 4 (top Z = 15.00) leaves 7.00 ft under the slab and tread 5 (top Z = 15.75) leaves 6.25 ft, so the opening begins at tread 5 (its first edge is Y = 10.93, rounded up to 11.0). It ends at Y = 4.0 where the 14th riser meets the terrace. The slab is continuous over Y = 11.0 to 24.0 and over Y = -0.75 to 4.0 in this lane.

### 7.4 South end of the stairs bay (X = 26.375 to 33.875, Y = 0 to 4.0 on lane A, Y = 0 to 7.0 on lane B) [M]

* The plan draws a thin double line across the bay at Y = about 4.0 and nothing else south of it. It is **not** a wall (its line weight is under half that of the stair walls). The area is floor at Z = 12.00 under the roof slab, bounded by the two stair walls and the south wall. On the north side it is closed by the solid lane A blocks (up to Z = 21.75); on lane B the floor simply continues north as FL3 (Y = 4.0 to 7.0) until the stairwell void begins.
* It has **no door and no practical way in** at floor level: the only approach from the north gallery is the 0.5 ft well beside the void, or climbing the flight. It is modelled as an enclosed, empty part of the bay (lane A: Y = 0 to 4.0; lane B: Y = 0 to 7.0). See section 14.1.

### 7.5 Shaft, Zone F-SH [M]

* Same box as the ground floor shaft, drawn again on this floor with a **thin single line** and the label "3 x 4": X = 28.0 to 32.0, Y = 19.5 to 22.5. It sits inside Zone F10 with margins of about 1.0 ft (W) and 0.5 ft (E), and 0.75 ft from the north wall.
* **Default build:** floor outline only. A thin raised border (0.1 ft high, 0.1 ft wide) around the rectangle, no walls, roof slab continuous above.
* **Option B (only if confirmed open-to-sky):** also cut a 4.0 x 3.0 ft hole in the roof slab at the same XY. **If the ground spec's Option B was taken, this hole must be taken too** (and the ground slab hole `[28.000, 32.000, 19.500, 22.500, 11.500, 12.000]` then shows here as a hole in the floor).
* On this floor the alcove lies **between Bathroom 1 (west) and Bathroom 2 (east)**, which makes a plumbing or duct shaft the likely purpose (Unknown; section 14.2).

### 7.6 Balcony floor and projecting plate [A]

* The balcony (F1, F2) and the western 3.25 ft of the master bedroom (F4, X = 0 to 3.25) lie over the ground-floor garden and gate landing, which the ground slab does not cover. Two extra plate boxes carry them: **ES-W** (X = -0.75 to 3.25, Y = -0.75 to 24.0) and **ES-S** (X = 3.25 to 50.0, Y = -0.75 to 0.0, a strip under the south wall, where the ground floor has no wall over the garage gate). Both are Z = 11.50 to 12.00 (section 8).
* Balcony floor level = house floor level (Z = 12.00): no step, no drop.
* Balcony outer walls (F-EXT-WEST for Y = 0 to 11.75, F-EXT-SOUTH for X = -0.75 to 14.0) are built **full height** because the plan draws them like every other exterior wall. A real balcony usually has a 3 ft parapet or a railing. Option D (7.8) lowers them.

### 7.7 Option C: balcony door through the kitchen south wall (default OFF)

The plan, as drawn and as annotated by the owner, shows the L-shaped balcony **sealed on every side**: master-bedroom side (owner's thin line), kitchen west and south walls, lobby west wall (continuous, no gap), and the exterior walls. No door is drawn. The one place where the original sketch had a gap is the south-east corner of the kitchen (X = about 10.9 to 13.625), where the kitchen platform also stops (X = 11.0). The owner then closed it with the heavy black bar.

If the owner confirms that the kitchen opens to the balcony (a "W.D" wash-and-dry balcony off the kitchen is common), apply:

* Replace F-INT-04 by `[3.250, 11.000, 4.000, 4.375, 12.000, 22.000]`.
* Add lintel F-LIN-07 `[11.000, 13.625, 4.000, 4.375, 19.000, 22.000]`.
* The door strip `[11.0, 13.625] x [4.0, 4.375]` belongs to F3. Clear width 2.625 ft.
* Totals become 57 solids (7 lintels). Verified: grid check passes (483 double cells) and the kitchen-to-balcony walk route is clear.

### 7.8 Option D: balcony outer walls as a parapet (default OFF)

Split F-EXT-WEST at Y = 11.75 and F-EXT-SOUTH at X = 14.0; lower the balcony pieces (F-EXT-WEST Y = 0 to 11.75, F-EXT-SOUTH X = -0.75 to 14.0) to Z = 12.00 to 15.00 (3 ft parapet), leaving the rest at full height. The roof slab stays as built. Do not add a railing.

---

## 8. Floor Plate and Roof Slab [A]

**Floor plate (Z = 11.50 to 12.00).** Top is the first-floor level.

* Boxes FL1 to FL4 are **identical to the ground floor boxes SL1 to SL4** (same coordinates, same stair opening). If both floors are built into one model, build them once.
* ES-W and ES-S are new (7.6). They carry the walls and floor that stand outside the ground floor's slab footprint.

**Roof slab (Z = 22.00 to 22.50).**

* Footprint: X = -0.75 to 50.00, Y = -0.75 to 24.00 (outer faces of the exterior walls).
* Cut-outs: lane A opening (7.3); shaft hole only under Option B (7.5).
* The roof slab top (Z = +22.50) is the terrace level where lane A ends.
* No parapet, mumty (stair head-room cover), water tank, beams, sunshades or overhang are specified. Do not add them.

---

## 9. Fixtures and Furniture

The first floor plan draws four fixtures and the owner labelled them. They are the **only** fixtures to build. Each is a plain solid box; heights are [A].

| ID | What | Box (X, Y) | Height | Basis |
| :--- | :--- | :--- | :--- | :--- |
| FX-KT-W | Kitchen platform, west arm | X = 3.625 to 5.625, Y = 4.375 to 11.375 | 2.75 | [M]: 2.0 ft deep along the full west wall |
| FX-KT-S | Kitchen platform, south arm | X = 3.625 to 11.000, Y = 4.375 to 6.625 | 2.75 | [M]: 2.25 ft deep, stops 2.6 ft short of the east wall |
| FX-BASIN | Hallway basin counter | X = 34.250 to 36.250, Y = 3.000 to 6.750 | 2.75 | [M] +/- 0.4: a 2.0 x 3.75 ft box against the stair east wall |
| FX-WM | Washing machine | X = 37.875 to 39.875, Y = 0.000 to 2.000 | 3.00 | [M] +/- 0.4: tucked into the south-east end of the hallway, against the mandir wall |

* The kitchen platform is the L-shaped pair of thin lines inside the kitchen, labelled "KT" and "kitchen-platform". Unlike the ground floor's inner kitchen lines, these were **not** erased in the modified image, so they are real. The two arms overlap at the corner (X = 3.625 to 5.625, Y = 4.375 to 6.625); union them.
* The basin niche (F5) contains **no** fixture box: the plan draws only the label and a width arrow there.
* No sanitary fixtures, no stove, no sink, no doors, no windows.

---

## 10. Blueprint Artifacts to Ignore (lines and marks that are not geometry)

The raw plan (`first-floor`) has dimension lines that were erased in the modified image (`firstfloor-modified`, where they appear as blurred patches). Do **not** build walls for any of them:

1. The thin vertical line inside the master bedroom at about X = 12 (from the north wall to the kitchen north wall), carrying the `11'-6"` label.
2. The thin vertical line in the lobby at about X = 24.4 (from the Bathroom 1 south wall to the south wall), carrying the `18'-10.5"` label.
3. The thin horizontal line at about Y = 13.5 to 14 from the stair east wall to about X = 38.5, carrying the `5'-7.5"` label (the hallway width).
4. The `13'-7.5"`, `9'-0"`, `7'-0"`, `4'-0"`, `3 X 4`, `12'-0"`, `10'-0"` and `7'-0"` figures, and the `<-3'3"->` arrow inside the basin niche. They are text.
5. **The thin single line across the basin niche at Y = about 19.25** (X = 14.0 to 17.25). It was **not** erased in the modified image, so it is drawn, but it has the weight of a single stroke where all walls are double lines, and a niche closed on all four sides would have no entrance. It is treated as the niche's edge line, **not** a wall (section 12, item 4).
6. The thick double line across the stairs bay at Y = about 4.0 to 4.2, below the last tread of both flights (7.4). It is a landing/foot line, not a wall.
7. The small cross-mark on the mandir west wall at Y = about 5.8, and the faint diagonal hatching inside the mandir and inside the hallway basin box. They are pen marks.
8. Hand-written balcony notes: the rotated `3'3" W.D` in the west balcony, the upside-down `BALCONY W.D 3'3"` along the south edge, and the blue `4'0"` beside it (the depth of the south balcony strip). Text, not geometry.
9. The `KT` mark in the kitchen.
10. All typed room labels ("master-bedroom", "kitchen", "lobby", ...) and the title "First Floor". They name rooms; they are not geometry.

Not artifacts (**build these**): the owner's thin black line (F-INT-02, X = 0 to 3.25), the owner's heavy black bar (F-INT-04, X = 10.4 to 13.625), the kitchen platform lines, the two boxes beside the hallway (basin, washing machine), and the shaft box.

---

## 11. Self-Check for the Builder (before finishing)

1. Box counts match section 13.9 (6 floor-plate boxes, 4 exterior wall boxes, 15 interior wall boxes, 6 lintels, 13 treads, 4 roof boxes, 4 fixtures, 4 shaft marker boxes). Nothing else.
2. No wall box overlaps a zone's clear floor area (corner overlaps between wall boxes are fine; there are none in the trimmed boxes).
3. The X chains end at 49.25 and the Y bays each sum to 23.25 (section 3.1).
4. Every wall stands on a floor-plate box (Z base = 12.00). The two exterior walls over the ground-floor gates stand on ES-W and ES-S.
5. Every opening in section 6 is open, every door-less gap has no leaf, and the balcony has **no** opening unless Option C is on.
6. Lane A reaches the roof slab top (Z = 22.50) at Y = 4.0 and the roof opening is clear above it. Lane B's void is open (Y = 7.0 to 13.25).
7. The stairs bay has no spine wall and no wall at Y = 4.0 (7.4). The basin niche has no south wall.
8. No windows, doors, railings, parapets or furniture were added beyond section 9.

---

## 12. Assumptions Register and Items to Confirm With the Plan's Author

Ranked by how much they would change the model:

1. **Balcony access.** No door to the balcony is drawn anywhere, so as drawn the balcony cannot be entered. Most likely a door from the kitchen at its south-east corner (Option C, 7.7), possibly from the lobby or the master bedroom. This is the one place where plan and common sense disagree.
2. **Z heights** (`Z_F1` 12.00 inherited from the ground spec, ceiling +22.00, slab 0.5, terrace +22.50, door head 7.0): none are on a 2D plan. Confirm from elevations or sections.
3. **Balcony outer wall height and openness.** The plan draws them as ordinary exterior walls (full height here). A balcony is normally open above a 3 ft parapet or railing (Option D, 7.8). Also the balcony's real width: 3'3" west strip [P], 4'0" south strip [P, blue ink over an original 3'3"].
4. **Basin niche south side.** Treated as open to the lobby (thin line ignored). If the line is a wall, the niche needs a door elsewhere; the only candidate is its west wall into the master bedroom.
5. **Upper stair flight:** direction (south-ascending), tread count (13 here; plan shows 12), riser 0.75 ft, the 0.5 ft well instead of a spine wall, and the unreachable south end of the bay (7.4).
6. **The owner's two black lines** are modelled as walls (F-INT-02 west part, F-INT-04 east part). If the heavy bar is really a door symbol, Option C is the answer.
7. **Opening sizes (all [M], +/- 0.25 ft):** master door 3.25 (end of wall F-INT-01 at Y = 15.0, chosen to match the stair-wall ends at the same Y), kitchen door 3.0, Bathroom 1 door 2.5, Bathroom 2 door 2.75, child door 3.5, mandir door 2.5. The mandir door is a gap at the north end of its west wall, not a drawn door line.
8. **Fixtures:** positions [M] +/- 0.4 ft; heights [A]. Platform depth 2.0 W arm vs 2.25 S arm is as measured.
9. **Shaft:** purpose, open-to-sky or not, whether it has walls (same question as the ground floor).
10. **Projecting plates ES-W, ES-S:** the first floor overhangs the garden by 3.25 ft and rests on nothing at the gates. Real structure (beams, cantilever) is not drawn.
11. **Wall thickness:** 9" exterior and 4.5" interior. Same as ground floor.
12. **Plan north** is assumed to be the top of the sheet.

---

## 13. Build Guide (step-by-step construction recipe)

This section turns sections 4 to 9 into an exact list of solid boxes. Build in the order given. If this section and an earlier section ever disagree, sections 4 to 9 win and this section has an error.

### 13.1 Conventions

* Every solid is an axis-aligned box written `[xmin, xmax, ymin, ymax, zmin, zmax]` in feet. Do not rotate, bevel or round anything.
* Union all solids into one model. Walls start at Z = 12.00, exactly on the top of the floor plate.
* The wall boxes here are the section 5 boxes already trimmed so that no two walls overlap. The union is identical to section 5.
* **Doorways are voids, not objects.** Every interior door is a clear gap from the floor (Z = 12.00) up to Z = 19.00. Above it, a **lintel** box fills the wall up to Z = 22.00. Full openings get no lintel.
* **Axis mapping.** The spec is Z-up and right-handed. For a Y-up engine such as three.js use `engine_x = X`, `engine_y = Z`, `engine_z = -Y`, so plan north points to engine -z. Do not mirror the plan.
* **Stacking on the ground model:** same origin and datum. Build FL1 to FL4 only once if the ground floor model (SL1 to SL4) is already present.
* No materials, textures, doors, windows or furniture are specified. Any colour is a presentation choice (13.10).

### 13.2 Step 1: floor plate

| ID | Box | Note |
| :--- | :--- | :--- |
| FL1 | `[3.250, 30.125, 0.000, 24.000, 11.500, 12.000]` | = ground SL1 |
| FL2 | `[33.875, 50.000, 0.000, 24.000, 11.500, 12.000]` | = ground SL2 |
| FL3 | `[30.125, 33.875, 0.000, 7.000, 11.500, 12.000]` | = ground SL3 (under lane B, south of the void) |
| FL4 | `[30.125, 33.875, 13.250, 24.000, 11.500, 12.000]` | = ground SL4 (north of the void) |
| ES-W | `[-0.750, 3.250, -0.750, 24.000, 11.500, 12.000]` | Projecting plate under the west wall, the balcony and the western 3.25 ft of the master bedroom (7.6). |
| ES-S | `[3.250, 50.000, -0.750, 0.000, 11.500, 12.000]` | Edge strip under the south wall east of X = 3.25 (7.6). |

### 13.3 Step 2: exterior walls

All four run from Z = 12.00 to 22.00. No window openings, no gates.

| ID | Box | Note |
| :--- | :--- | :--- |
| F-EXT-N | `[-0.750, 50.000, 23.250, 24.000, 12.000, 22.000]` | North wall, full width. |
| F-EXT-E | `[49.250, 50.000, 0.000, 23.250, 12.000, 22.000]` | East wall. |
| F-EXT-W | `[-0.750, 0.000, 0.000, 23.250, 12.000, 22.000]` | West wall, unbroken (balcony side for Y = 0 to 11.75). |
| F-EXT-S | `[-0.750, 50.000, -0.750, 0.000, 12.000, 22.000]` | South wall, unbroken (balcony side for X = -0.75 to 14.0). |

### 13.4 Step 3: interior walls and lintels

Full-height wall boxes (Z = 12.000 to 22.000):

| ID | Box | Note |
| :--- | :--- | :--- |
| F-INT-01 | `[13.625, 14.000, 15.000, 23.250, 12.000, 22.000]` | Master bedroom east wall. |
| F-INT-02 | `[0.000, 14.000, 11.375, 11.750, 12.000, 22.000]` | Master bedroom south / kitchen north wall, full length (includes the owner's thin line, X = 0 to 3.25). |
| F-INT-03 | `[3.250, 3.625, 4.375, 11.375, 12.000, 22.000]` | Kitchen west wall. |
| F-INT-04 | `[3.250, 13.625, 4.000, 4.375, 12.000, 22.000]` | Kitchen south wall, full width (includes the owner's heavy bar). |
| F-INT-05 | `[13.625, 14.000, 0.000, 8.375, 12.000, 22.000]` | Lobby west wall, south part. |
| F-INT-06 | `[17.250, 17.625, 18.875, 23.250, 12.000, 22.000]` | Basin niche east wall / Bathroom 1 west wall. |
| F-INT-07 | `[20.125, 27.000, 18.875, 19.250, 12.000, 22.000]` | Bathroom 1 south wall, east of its door. |
| F-INT-08 | `[26.625, 27.000, 19.250, 23.250, 12.000, 22.000]` | Bathroom 1 east wall. |
| F-INT-09 | `[26.000, 26.375, 0.000, 15.000, 12.000, 22.000]` | Stairs bay west wall. |
| F-INT-10 | `[33.875, 34.250, 0.000, 15.000, 12.000, 22.000]` | Stairs bay east wall. |
| F-INT-11 | `[32.500, 32.875, 19.250, 23.250, 12.000, 22.000]` | Bathroom 2 west wall. |
| F-INT-12 | `[32.500, 37.125, 18.875, 19.250, 12.000, 22.000]` | Bathroom 2 south wall, west of its door. |
| F-INT-13 | `[39.875, 40.250, 12.875, 23.250, 12.000, 22.000]` | Hallway / child bedroom wall, Bathroom 2 east wall. |
| F-INT-14 | `[39.875, 49.250, 9.000, 9.375, 12.000, 22.000]` | Mandir north wall. |
| F-INT-15 | `[39.875, 40.250, 0.000, 6.500, 12.000, 22.000]` | Mandir west wall, south of the mandir door. |

Lintels (Z = 19.000 to 22.000). Each sits above one doorway whose clear opening is Z = 12.000 to 19.000:

| ID | Box | Doorway below it | Clear width |
| :--- | :--- | :--- | :--- |
| F-LIN-01 | `[13.625, 14.000, 11.750, 15.000, 19.000, 22.000]` | Master bedroom door | 3.250 |
| F-LIN-02 | `[13.625, 14.000, 8.375, 11.375, 19.000, 22.000]` | Kitchen door | 3.000 |
| F-LIN-03 | `[17.625, 20.125, 18.875, 19.250, 19.000, 22.000]` | Bathroom 1 door | 2.500 |
| F-LIN-04 | `[37.125, 39.875, 18.875, 19.250, 19.000, 22.000]` | Bathroom 2 door | 2.750 |
| F-LIN-05 | `[39.875, 40.250, 9.375, 12.875, 19.000, 22.000]` | Child bedroom door | 3.500 |
| F-LIN-06 | `[39.875, 40.250, 6.500, 9.000, 19.000, 22.000]` | Mandir door | 2.500 |

Open boundaries that get **no** wall and no lintel: the basin niche's south side (Y = 18.875, X = 14.0 to 17.25), the line X = 26.0 at Y = 15.0 to 18.875 (lobby to gallery), the line Y = 15.0 across the stairs bay (X = 26.375 to 33.875), the line Y = 18.875 between X = 27.0 and 32.5 (gallery to alcove), and the line X = 34.25 at Y = 15.0 to 18.875 (gallery to hallway). The balcony has no opening in the default build.

### 13.5 Step 4: upper staircase (lane A)

Thirteen solid blocks, each X = 26.375 to 29.625, starting at Z = 12.000. Run 0.770 ft per tread, riser 0.750 ft, ascending **south** from Y = 14.010. The 14th riser is at Y = 4.000, up to the roof-slab top (Z = 22.500).

| Tread | Y min | Y max | Top Z | Box |
| :--- | :--- | :--- | :--- | :--- |
| U01 | 13.240 | 14.010 | 12.750 | `[26.375, 29.625, 13.240, 14.010, 12.000, 12.750]` |
| U02 | 12.470 | 13.240 | 13.500 | `[26.375, 29.625, 12.470, 13.240, 12.000, 13.500]` |
| U03 | 11.700 | 12.470 | 14.250 | `[26.375, 29.625, 11.700, 12.470, 12.000, 14.250]` |
| U04 | 10.930 | 11.700 | 15.000 | `[26.375, 29.625, 10.930, 11.700, 12.000, 15.000]` |
| U05 | 10.160 | 10.930 | 15.750 | `[26.375, 29.625, 10.160, 10.930, 12.000, 15.750]` |
| U06 | 9.390 | 10.160 | 16.500 | `[26.375, 29.625, 9.390, 10.160, 12.000, 16.500]` |
| U07 | 8.620 | 9.390 | 17.250 | `[26.375, 29.625, 8.620, 9.390, 12.000, 17.250]` |
| U08 | 7.850 | 8.620 | 18.000 | `[26.375, 29.625, 7.850, 8.620, 12.000, 18.000]` |
| U09 | 7.080 | 7.850 | 18.750 | `[26.375, 29.625, 7.080, 7.850, 12.000, 18.750]` |
| U10 | 6.310 | 7.080 | 19.500 | `[26.375, 29.625, 6.310, 7.080, 12.000, 19.500]` |
| U11 | 5.540 | 6.310 | 20.250 | `[26.375, 29.625, 5.540, 6.310, 12.000, 20.250]` |
| U12 | 4.770 | 5.540 | 21.000 | `[26.375, 29.625, 4.770, 5.540, 12.000, 21.000]` |
| U13 | 4.000 | 4.770 | 21.750 | `[26.375, 29.625, 4.000, 4.770, 12.000, 21.750]` |

Do not add handrails, stringers, a spine wall in the well (X = 29.625 to 30.125) or a landing. Lane B is not rebuilt (ground floor treads T01 to T12).

### 13.6 Step 5: roof slab

Roof slab top is Z = 22.500. The lane A opening is X = 26.375 to 29.625, Y = 4.000 to 11.000, built by four boxes that leave it out:

| ID | Box |
| :--- | :--- |
| RF1 | `[-0.750, 26.375, -0.750, 24.000, 22.000, 22.500]` |
| RF2 | `[29.625, 50.000, -0.750, 24.000, 22.000, 22.500]` |
| RF3 | `[26.375, 29.625, -0.750, 4.000, 22.000, 22.500]` |
| RF4 | `[26.375, 29.625, 11.000, 24.000, 22.000, 22.500]` |

If the shaft is confirmed open-to-sky (7.5, Option B), subtract `[28.000, 32.000, 19.500, 22.500, 22.000, 22.500]` from the roof slab after building it.

### 13.7 Step 6: fixtures

| ID | Box |
| :--- | :--- |
| FX-KT-W | `[3.625, 5.625, 4.375, 11.375, 12.000, 14.750]` |
| FX-KT-S | `[3.625, 11.000, 4.375, 6.625, 12.000, 14.750]` |
| FX-BASIN | `[34.250, 36.250, 3.000, 6.750, 12.000, 14.750]` |
| FX-WM | `[37.875, 39.875, 0.000, 2.000, 12.000, 15.000]` |

### 13.8 Step 7: shaft marker (default build)

A thin raised border on the floor, no walls (7.5). Each box is 0.1 ft wide and 0.1 ft tall:

| ID | Box |
| :--- | :--- |
| FSH-S | `[28.000, 32.000, 19.500, 19.600, 12.000, 12.100]` |
| FSH-N | `[28.000, 32.000, 22.400, 22.500, 12.000, 12.100]` |
| FSH-W | `[28.000, 28.100, 19.600, 22.400, 12.000, 12.100]` |
| FSH-E | `[31.900, 32.000, 19.600, 22.400, 12.000, 12.100]` |

### 13.9 Step 8: verification (do not skip)

**Counts.** If any count differs, a piece is missing or extra.

| Group | Count |
| :--- | :--- |
| Floor-plate boxes (FL1-FL4, ES-W, ES-S) | 6 |
| Exterior walls | 4 |
| Interior full-height walls | 15 |
| Lintels | 6 |
| Upper stair treads | 13 |
| Roof slab boxes | 4 |
| Fixtures | 4 |
| Shaft marker boxes | 4 |
| **Total solids** | **56** |

(With Option C: 15 walls, 7 lintels, **57** solids. FL1-FL4 are shared with the ground floor model: 52 if they already exist there.)

**Clear floor areas** (width x depth from section 4, in sq ft). Check each room's empty floor against it:

| Zone | Area | Zone | Area | Zone | Area |
| :--- | :--- | :--- | :--- | :--- | :--- |
| F1 South balcony | 54.50 | F2 West balcony | 23.97 | F3 Kitchen | 70.00 |
| F4 Master bedroom | 156.69 | F5 Basin niche | 14.22 | F6 Bathroom 1 | 36.00 |
| F7 Lobby | 226.50 | F8 Stairs bay | 112.50 | F9 North gallery | 31.97 |
| F10 Shaft alcove | 24.06 | F11 Bathroom 2 | 28.00 | F12 Hallway | 106.17 |
| F13 Child bedroom | 124.88 | F14 Mandir | 81.00 | | |

Door strips add to the zone that owns them: F6 +0.94, F7 +2.34, F11 +1.03, F13 +1.31, F14 +0.94. Total zone area including strips = 1097.02 sq ft; wall footprint area = 159.05 sq ft; together 1256.06 = 50.75 x 24.75, the whole footprint.

**Walk test.** A person 2.5 ft wide and 6.5 ft tall must be able to walk each route below with no wall, fixture, stair block or void in the way. Waypoints are (X, Y) in feet; the floor is Z = 12.00. (The two 2.50 ft doors pass with zero clearance.)

| # | Route | Waypoints |
| :--- | :--- | :--- |
| 1 | Stair arrival to lobby | (32.0, 14.6) -> (32.0, 16.9) -> (24.0, 16.9) -> (20.0, 10.0) |
| 2 | Lobby to kitchen | (20.0, 9.875) -> (11.0, 9.875) -> (9.0, 9.0) |
| 3 | Lobby to master bedroom | (20.0, 13.375) -> (11.0, 13.375) -> (8.0, 15.0) |
| 4 | Lobby to Bathroom 1 | (18.875, 17.0) -> (18.875, 20.6) -> (22.0, 21.0) |
| 5 | Lobby to basin niche | (15.625, 17.0) -> (15.625, 21.0) |
| 6 | North gallery to shaft alcove | (30.0, 17.0) -> (30.0, 21.0) |
| 7 | Hallway to Bathroom 2 | (38.5, 17.0) -> (38.5, 20.6) -> (36.0, 21.5) |
| 8 | Hallway to child bedroom | (37.5, 11.125) -> (41.6, 11.125) -> (44.5, 14.0) |
| 9 | Hallway to mandir | (37.5, 7.75) -> (41.6, 7.75) -> (44.5, 4.5) |
| 10 | Lobby to gallery to hallway (south end) | (20.0, 17.0) -> (30.0, 17.0) -> (37.0, 16.9) -> (38.0, 3.5) |
| 11 | Kitchen interior (clear of the platform) | (13.0, 10.0) -> (9.0, 9.0) |
| 12 | Gallery to the foot of the upper flight | (28.0, 17.0) -> (28.0, 15.6) |

**Blocked test.** A straight line between each pair below must hit a wall:

| Pair | Wall that blocks it |
| :--- | :--- |
| Kitchen (8, 9) to master bedroom (8, 15) | F-INT-02 |
| Kitchen (8, 9) to south balcony (8, 2) | F-INT-04 |
| Kitchen (7, 9) to west balcony (1.5, 9) | F-INT-03 |
| Master bedroom (8, 15) to west balcony (1.5, 9) | F-INT-02 |
| Lobby (20, 2) to south balcony (10, 2) | F-INT-05 |
| Lobby (20, 6) to kitchen (10, 6) | F-INT-05 |
| Lobby (22, 10) to stairs bay (28, 10) | F-INT-09 |
| Hallway (37, 10) to stairs bay (30, 10) | F-INT-10 |
| Hallway (37, 5) to mandir (45, 5) | F-INT-15 |
| Hallway (37, 15) to child bedroom (45, 15) | F-INT-13 |
| Mandir (45, 4) to child bedroom (45, 15) | F-INT-14 |
| Bathroom 1 (22, 21) to shaft alcove (30, 21) | F-INT-08 |
| Bathroom 1 (22, 21) to basin niche (15.6, 21) | F-INT-06 |
| Master bedroom (8, 20) to basin niche (15.5, 20) | F-INT-01 |
| Shaft alcove (30, 21) to Bathroom 2 (36, 21) | F-INT-11 |
| Bathroom 2 (36, 21) to hallway (36, 17) | F-INT-12 |
| Bathroom 2 (38, 21) to child bedroom (45, 21) | F-INT-13 |
| West balcony (1.5, 2) to outside (-2, 2) | F-EXT-WEST |
| Lobby (20, 2) to outside (20, -2) | F-EXT-SOUTH |
| Child bedroom (45, 20) to outside (45, 26) | F-EXT-NORTH |
| Mandir (45, 5) to outside (52, 5) | F-EXT-EAST |

**Vertical checks.**

* Standing at (20, 10) in the lobby (Z = 12.00), the ceiling is at Z = 22.00 and the clear height is 10.00 ft.
* The top of every doorway is Z = 19.00, which gives 7.00 ft of clear height above the floor.
* Lane A: tread 1 top Z = 12.75, tread 4 = 15.00, tread 5 = 15.75, tread 13 = 21.75; the 14th riser (0.75 ft) reaches the roof-slab top at Z = 22.50 at Y = 4.0.
* Headroom under the roof slab above each tread = 22.00 - top: tread 4 leaves 7.00 ft, tread 5 leaves 6.25 ft. Treads 5 to 13 are all under the roof opening (Y = 4.0 to 11.0), so nothing is bumped.
* Over lane B, the floor opening (Y = 7.0 to 13.25) is clear from Z = 11.50 up to the roof slab at 22.00.
* The master bedroom floor at (1.5, 17.0), which lies over the former garden (X < 3.25), is Z = 12.00 and sits on ES-W.

**Grid check (programmatic).** Sample the plan on a 0.125 ft grid over X = -0.75 to 50.0, Y = -0.75 to 24.0. Every cell must lie inside exactly one of: a wall footprint (exterior or interior), or a zone in section 4; the only permitted double count is a doorway strip that is both a lintel footprint and part of its zone (420 cells in the default build = 6.5625 sq ft). No cell may be empty. No two wall boxes overlap. Every wall footprint lies inside the floor plate.

### 13.10 Optional colours (presentation only, not part of the plan)

| Element | Suggested colour |
| :--- | :--- |
| Exterior walls | `#d9d4c7` |
| Interior walls and lintels | `#ece8dd` |
| Stair treads | `#b9b2a3` |
| Floor plate and roof slab | `#c9c4b8` |
| Fixtures | `#a58f6f` |
| Shaft marker | `#c0392b` |

### 13.11 Common mistakes to avoid

1. Adding windows, doors, railings, parapets or furniture beyond section 9.
2. Building doorways as thin gaps up to the ceiling. They must be 7.00 ft tall with a lintel above. (The niche, gallery and stair-bay boundaries are full openings.)
3. Putting a gate in the west or south wall. On this floor those walls are unbroken.
4. Giving the stairs bay a spine wall between the flights, or a wall across it at Y = 4.0.
5. Closing the basin niche with a south wall. The thin line there is not a wall (10, item 5).
6. Building the lobby west wall with a door to the balcony (no door is drawn; Option C is the kitchen's south wall, and is off by default).
7. Forgetting the projecting plates ES-W and ES-S, which leaves the balcony floor and the walls over the gates floating.
8. Letting the roof slab cover the lane A opening (Y = 4.0 to 11.0), or putting the opening over lane B.
9. Starting the stair at the wrong end: lane A starts at Y = 14.01 (Z = 12.00) and rises **southward** to Y = 4.0 (Z = 22.50).
10. Building the kitchen platform as a wall, or omitting it. It is a 2.75 ft high box, not a wall.
11. Mirroring the plan or swapping X and Y. East is +X, north is +Y; north is the top of the sheet.
12. Treating section 14 as instructions. It is commentary.

---

## 14. Design-Sense Review (commentary for the human; the builder must NOT act on this)

Sections 4 to 9 check that the geometry is consistent with the plan. This section asks a different question: does the plan work as a house? Each item is marked **Sensible**, **Questionable** or **Unknown**, with the evidence. None of it changes the model. If the owner confirms a change, edit sections 4 to 9 and not this section.

### 14.1 Circulation and access

| Check | Verdict | Evidence |
| :--- | :--- | :--- |
| Every room is reachable | Questionable | From the stairs: gallery -> lobby -> kitchen, master bedroom, Bathroom 1, basin niche; gallery -> hallway -> Bathroom 2, child bedroom, mandir; gallery -> shaft alcove. **The balcony cannot be entered** as drawn (section 12, item 1), and the south end of the stairs bay (7.4) has no practical way in. |
| Balcony with no door | Questionable | The balcony is a closed L-shaped corridor on all four sides. Almost certainly a drawing omission. The likeliest door is at the kitchen's south-east corner (7.7). |
| Stairs bay south end (lane A Y = 0 to 4.0, lane B Y = 0 to 7.0, unreachable) | Unknown | It lies above the ground floor's south hallway and stair foot. Probably dead space under the head of the terrace stair; nothing on the plan uses it. |
| Kitchen has a single door, to the lobby | Sensible | Same arrangement as the ground floor kitchen. The kitchen's west and south sides face the balcony, which would be the natural place for a window or a second door. |
| Master bedroom opens to the lobby with a 3.25 ft gap and has no attached bathroom | Questionable | The nearest bathroom is Bathroom 1, reached across the lobby through a 2.5 ft door. A basin niche sits on the master bedroom's wall, but it opens to the lobby, not into the bedroom. |
| Child bedroom has no attached bathroom | Unknown | Bathroom 2's door opens onto the hallway, about 8 ft along from the child bedroom door. |
| Mandir is a 9 x 9 ft room with a 2.5 ft door | Sensible | A prayer room directly off the hallway, with its own walls, as the plan draws it. 9 x 9 ft is generous. |
| One stair, one escape route | Questionable | The plan has no second exit from this floor (the balcony is sealed). A single stair is common for a small house. |

### 14.2 Light and ventilation

* **No windows or ventilators appear anywhere on this plan** (Questionable), same as the ground floor. Section 1 tells the builder not to add any. This is missing information, not a design error.
* The **kitchen, master bedroom and the balcony have outside walls** here (the kitchen's west and south walls face the balcony; the master bedroom has the north and west exterior walls). That makes this floor much better placed for natural light than the ground floor kitchen. Unknown whether any window exists.
* The **shaft alcove sits exactly between Bathroom 1 and Bathroom 2** and the shaft stacks with the ground-floor shaft. That makes a plumbing or ventilation duct for the two bathrooms a strong reading (Unknown): on the ground floor it could not be linked to any washroom.
* Both bathrooms and the child bedroom each have a north exterior wall for a ventilator; the basin niche and Bathroom 1 share the same north wall.
* Action for the owner: ask where windows and ventilators go. Until then the model stays windowless on purpose.

### 14.3 Vertical design

| Item | Verdict | Evidence |
| :--- | :--- | :--- |
| Upper flight: 14 risers of 9.0" with a 9.24" going | Sensible | Comfortable proportions, in contrast to the ground flight (13 risers at 9.7"). Both stair counts are assumptions ([A]); the plan only fixes the extent Y = 4.0 to 14.0. |
| Two flights share one bay, turning at the north | Sensible | A U-turn stair with the turn at the first-floor level is common for a house with a roof terrace. |
| Terrace reached directly, no stair-head cover | Unknown | The plan draws no mumty room. Roofs reached by an open stair normally need a stair-head cover (a small roofed enclosure at the top of the stair), which is above the drawn floor. |
| Roof opening Y = 4.0 to 11.0 over lane A | Sensible | Follows the 6.75 ft headroom rule: tread 5 is the first with less than 6.75 ft. This part is reasoning, not tracing. |
| Same 10 ft clear height as the ground floor | Sensible | An assumption carried over; it also makes lane A rise 10.5 ft, the same as the ground flight. |
| Balcony floor level equal to the room floor | Questionable | Balconies are normally lowered 2 to 4 inches for drainage. Not on the plan. |

### 14.4 Openings and sizes

* Door widths are 3.25 ft (master bedroom), 3.0 ft (kitchen), 3.5 ft (child bedroom), 2.75 ft (Bathroom 2) and 2.5 ft (Bathroom 1, mandir). All are measured values with +/- 0.25 ft. The master bedroom's 3.25 is on the wide side; the owner may have intended 3.0 (move the end of F-INT-01 from Y = 15.0 to 14.75).
* The mandir's opening is a gap in the **north end of its west wall**, next to the corner. A door right at the corner leaves little wall to the hinge side. This reads from the plan but is Questionable.
* The master bedroom and kitchen doors sit one wall-end apart (0.375 ft), on the lobby's west side. Plan-faithful; the two doors are 3.5 ft centre to centre.
* The 3.875 ft gaps to the hallway and lobby are plain gaps, so they may be arches or door-less openings (same note as the ground floor).

### 14.5 Structure

* The plan shows walls only. A two-storey house with 4.5" walls is almost certainly **framed with columns and beams**; none are drawn, so the model has none, and the builder must not add them.
* **The first floor projects 3.25 ft over the garden** (the master bedroom's west part, and the balcony). That is a cantilever beyond the ground walls. The plan does not show it. The model carries it with ES-W.
* **The first-floor south wall stands over the ground-floor garage gate** (12.75 ft clear span) and the west wall over the pedestrian gate (7.5 ft). Both need a beam that the plan does not show. ES-S represents it as a plain strip.
* Several first-floor walls have no wall below them: the kitchen south wall (over the porch), the basin niche and Bathroom 1 walls (over the ground lobby), Bathroom 2's west and east walls (offset 1.4 ft from the ground East washroom walls), the mandir and child walls (over the garage and the storeroom). In real construction these sit on beams. They are Questionable only because the beams are not drawn.
* The 9" exterior wall is a common convention, not a plan measurement (section 2).

### 14.6 Layout logic

* **Plumbing:** Bathroom 1 (X = 17.6 to 26.6) does not sit over the ground floor's West washroom (X = 3.6 to 13.6), and Bathroom 2 is offset 1.4 ft from the ground East washroom. Both bathrooms do touch the alcove with the stacked shaft, so a single stack through the alcove can serve both. That is a likely reason for the layout (Unknown).
* **Kitchen position:** the kitchen is not over the ground kitchen. Its stack (if any) would need to run to the shaft alcove across the lobby. Not a modelling problem.
* **Daily flow:** the lobby is a large hub (12 x 18.9 ft) with the kitchen, master bedroom, Bathroom 1, the basin niche and the stairs on its edges, and the hallway reaching the child bedroom, mandir and Bathroom 2. This reads like a sensible hub arrangement. Sensible.
* **Wet and dry rooms:** the master bedroom shares its east wall with the basin niche, and Bathroom 1 is adjacent to the niche. Noise and damp are the usual issues. Fine in most houses.
* **Hallway fixtures:** the washing machine and the basin are in the hallway, away from the bathrooms. A washing machine needs a water supply and a drain; the hallway wall it leans on (the mandir wall) is the far side from the shaft. Unknown how it is served.

### 14.7 What to do with this section

| Question for the owner | Affects |
| :--- | :--- |
| How is the balcony entered? Is the heavy black bar a wall or a door? | Section 7.7, F-INT-04, 12 items 1 and 6 |
| Is the balcony open above a parapet? | Section 7.8, exterior wall heights |
| Is the line across the basin niche a wall? If yes, where is the niche door? | 10 item 5, F5 |
| Does the upper flight have 12, 13 or another number of treads, and does it turn? | Section 7.1 to 7.3 |
| Where are the windows and ventilators? | Adds openings to exterior walls |
| Is the master bedroom door 3.25 ft or 3.0 ft? | F-INT-01 end |
| Are there columns and beams, and what carries the 3.25 ft projection? | New structural elements if wanted |
