# 3D Architectural Specification: Ground Floor Plan

## 0. How to read this document

Every number is tagged with where it came from. The 3D builder must treat them differently.

| Tag | Meaning | Reliability |
| :--- | :--- | :--- |
| **[P]** | Written on the plan as a dimension label (e.g. 12'-0", 3'-3", 7'-7.5") | Exact |
| **[D]** | Derived by arithmetic from [P] values (wall-chain sums, wall positions that follow from room sizes) | Exact, as long as the [P] values are right |
| **[M]** | Measured off the photographed plan (about 45 px per ft; the photo is slightly skewed) | +/- 0.25 ft on clean features, +/- 0.5 ft otherwise |
| **[A]** | Assumption. NOT on the plan (all Z heights, wall thicknesses, step heights, slab thickness, door heads, etc.) | Replaceable. Listed in section 12 |

Coordinates are internally consistent to 0.001 ft because they are sums of labelled dimensions. That is not survey accuracy. Anything tagged [M] or [A] is only as good as its tag says.

---

## 1. Target LLM Prompt Header

> **System Instruction for 3D Builder LLM:** Build a 3D model of the **ground floor of a multi-storey residential building** (a staircase leads to an upper floor that is not drawn) using only the coordinates, elevations (Z), wall segments and openings in this document. Do **not** add partitions, windows, door leaves, furniture, counters, fixtures or any element not listed here. Every opening is a bare gap in a wall. Units are feet. Where two wall boxes overlap at a corner, union them. Use the parameters in section 2 so that assumptions can be changed in one place.

> **Section 14 is review commentary for the human reader. Do not act on it: build exactly what sections 4 to 8 specify, even where section 14 questions a design choice.**

---

## 2. Global Parameters

| Parameter | Value | Tag | Note |
| :--- | :--- | :--- | :--- |
| `T_INT` interior wall thickness | 0.375 ft (4.5") | [M]/[D] | Drawn thickness is about 0.38-0.44 ft and the dimension chains close exactly with 0.375 |
| `T_EXT` exterior wall thickness | 0.75 ft (9") | [A] | Drawn lines suggest 0.4-0.6 ft but the photo is not reliable here |
| `Z_STREET` street, gate landing, garden | 0.00 | [A] | Reference datum |
| `Z_PLINTH` house floor level | +1.50 | [A] | Implied by "3 steps" at the entrance, but the height is not written on the plan |
| `Z_CEIL` underside of slab | +11.50 | [A] | 10.00 ft clear above plinth |
| `T_SLAB` slab thickness | 0.50 | [A] | Slab occupies Z in [11.50, 12.00] |
| `Z_UPPER` upper floor finished level | +12.00 | [A] | = `Z_CEIL` + `T_SLAB` (top of the slab). The stair climbs to this level |
| `Z_GAR_S` / `Z_GAR_N` garage floor, south / north end | 0.00 / +0.50 | [A] | Gentle slope toward the north |
| `H_DOOR` head height of interior openings | 7.00 | [A] | Measured from the local floor, so the head is at Z = 8.50 for openings on the plinth. Wall above is solid up to the slab |
| Exterior wall top | = `Z_CEIL` | [A] | Boundary-wall height around the garden is unknown (see section 12) |

---

## 3. Coordinate System

* **Origin (0, 0, 0)**: inner south-west corner of the plot boundary, at street level.
* **+X = East (right on the plan).** Internal span 0 to 49.25 ft. Outer face of the east wall at X = 50.00.
* **+Y = North (top of the plan).** Internal span 0 to 23.25 ft. Outer face of the north wall at Y = 24.00.
* **+Z = up.**
* Plan north is assumed to be the top of the sheet [A]. The plan has no north arrow.

### 3.1 Dimension-chain checks (all [P] -> [D])

North-South (Y), three independent bays, each totals 23.25 ft:

* West bay: Porch 7.50 + wall 0.375 + Bedroom 11.00 + wall 0.375 + West washroom 4.00 = 23.25
* Central bay: South hallway 4.00 + wall 0.375 + Kitchen 7.00 + wall 0.375 + Lobby 11.50 = 23.25
* East bay: Garage 15.00 + wall 0.375 + Storeroom 7.875 = 23.25

East-West (X):

* Garden 3.25 + wall 0.375 + Bedroom 10.00 = 13.625; + wall 0.375 = 14.000; + Kitchen/Lobby 12.00 = 26.000; + wall 0.375 = 26.375; + Stairs bay 7.50 = 33.875; + wall 0.375 = 34.250; + Garage 15.00 = **49.250**
* Stairs bay: West passage 3.75 + East flight 3.75 = 7.50
* East washroom 7.00 + wall 0.375 + Storeroom 7.625 = 15.00 (equals the garage width)

---

## 4. Rooms and Zones (clear interior floor areas)

Each zone's floor is a **solid block from Z = 0.00 up to the floor Z listed** (this forms the plinth fill and removes any chance of a hole under a wall or floor).

| Zone | Label | X min | X max | Y min | Y max | Clear size | Floor Z | Above | Basis |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| Z1 | Gate landing | 0.000 | 3.250 | 0.000 | 7.500 | 3'3" x 7'6" | 0.00 | Open | [P]/[M] |
| Z2 | Garden | 0.000 | 3.250 | 7.500 | 23.250 | 3'3" x 15'9" | 0.00 | Open to sky | [P]/[D] |
| Z3 | Entrance steps and porch | 3.250 | 13.625 | 0.000 | 7.500 | 10'4.5" x 7'6" | 0.00 to 1.50 (steps, section 7.1) | Slab | [P]/[D] |
| Z4 | Bedroom | 3.625 | 13.625 | 7.875 | 18.875 | 10'0" x 11'0" | 1.50 | Slab | [P] |
| Z5 | West washroom | 3.625 | 13.625 | 19.250 | 23.250 | 10'0" x 4'0" | 1.50 | Slab | [P] |
| Z6 | South hallway | 13.625 | 26.375 | 0.000 | 4.000 | 12'9" x 4'0" | 1.50 | Slab | [P]/[D] |
| Z7 | Kitchen | 14.000 | 26.000 | 4.375 | 11.375 | 12'0" x 7'0" | 1.50 | Slab | [P] |
| Z8 | Lobby | 14.000 | 26.000 | 11.750 | 23.250 | 12'0" x 11'6" | 1.50 | Slab | [P] |
| Z9A | Stairs bay, west passage (and foot of flight) | 26.375 | 30.125 | 0.000 | 15.000 | 3'9" x 15'0" | 1.50 | Slab | [P]/[D] |
| Z9B | Stairs bay, flight lane | 30.125 | 33.875 | 0.000 | 15.000 | 3'9" x 15'0" | 1.50, flight per 7.2 | Slab with cut-out (7.3) | [P]/[D] |
| Z10 | Shaft | 28.000 | 32.000 | 19.500 | 22.500 | 4'0" x 3'0" | 1.50 | See 7.4 | [M] |
| Z11 | East hallway | 26.375 | 41.250 | 15.000 | 18.875 | 14'10.5" x 3'10.5" | 1.50 | Slab | [D] |
| Z12 | East washroom | 34.250 | 41.250 | 19.250 | 23.250 | 7'0" x 4'0" | 1.50 | Slab | [P] |
| Z13 | Storeroom | 41.625 | 49.250 | 15.375 | 23.250 | 7'7.5" x 7'10.5" | 1.50 | Slab | [P] |
| Z14 | Garage | 34.250 | 49.250 | 0.000 | 15.000 | 15'0" x 15'0" | 0.00 to 0.50 | Slab | [P] |
| Z15 | Shaft alcove | 26.375 | 33.875 | 18.875 | 23.250 | 7'6" x 4'4.5" | 1.50 | Slab | [D] |

Notes:

* Z15 covers the area around the shaft so that no hole is left in the floor. Z10 sits inside Z15; build Z15 as one floor block.
* Z9A and Z9B together span the whole stairs bay at Y = 0 to 4.0. The bay is open to the south hallway on its west side, so the hallway effectively runs from X = 13.625 to 33.875 at Y = 0 to 4.0.
* Threshold floor strips are part of the room they lead into: the bedroom-lobby passage floor (X 13.625 to 14.0, Y 15.0 to 18.875) belongs to Z8, and the storeroom doorway floor (X 41.25 to 41.625, Y 15.375 to 18.875) belongs to Z13.
* Z14 and Z11 are open to each other along X = 34.25 to 41.25 at Y = 15.0 (see 7.5 for the step).

---

## 5. Wall Registry (bounding boxes `[Xmin, Xmax, Ymin, Ymax]`)

### 5.1 Exterior walls (`T_EXT`, Z from 0.00 to `Z_CEIL`)

| ID | Box | Notes |
| :--- | :--- | :--- |
| W-EXT-NORTH | [-0.750, 50.000, 23.250, 24.000] | Continuous. |
| W-EXT-EAST | [49.250, 50.000, 0.000, 24.000] | Continuous. |
| W-EXT-WEST | [-0.750, 0.000, 7.500, 24.000] | Plan shows the wall ending level with the bedroom's south wall. The pedestrian **GATE** opening is therefore Y = 0 to 7.5 [M], matching zone Z1. No gate leaf is modelled. |
| W-EXT-SOUTH | [-0.750, 36.500, -0.750, 0.000] | See the south-edge warning below. The **GARAGE-GATE** opening is X = 36.5 to 49.25 [M]. |

**South-edge warning [M]:** along the south edge the plan has two roughly parallel lines that end at different X positions (about X = 26 and about X = 36.5, +/- 1). One is the wall and the other looks like a dimension line with arrowheads. I treated the longer one as the wall (36.5). If the owner says the wall ends earlier, shorten W-EXT-SOUTH; nothing else changes.

### 5.2 Interior walls (`T_INT`)

**All interior walls run from Z = 0.00 to `Z_CEIL`.** The part below the floor is hidden inside the plinth fill, but starting at 0.00 leaves no gap where the other side of the wall is the garage (floor Z 0.00 to 0.50), the entrance steps, or the garden.

| ID | Box | Openings / notes |
| :--- | :--- | :--- |
| W-INT-01 | [3.250, 3.625, 7.500, 23.250] | Solid. Garden / house divider and plinth retaining wall. |
| W-INT-02 | [3.250, 10.625, 7.500, 7.875] | Ends at X = 10.625. **Bedroom door**: X = 10.625 to 13.625 (3.00 ft). Overlaps W-INT-01 at the corner; union. |
| W-INT-03 | [3.625, 14.000, 18.875, 19.250] | Solid. Bedroom / west washroom divider. Runs to X = 14.0, closing the corner with W-INT-04. |
| W-INT-04 | [13.625, 14.000, 21.625, 23.250] | A short stub at the north end only (about 1.6 ft). **West washroom door**: Y = 19.250 to 21.625 (about 2.4 ft) at X = 13.625 to 14.0, opening east into the Lobby. |
| W-INT-05 | [13.625, 14.000, 4.000, 15.000] | Solid. **Bedroom-Lobby passage**: Y = 15.000 to 18.875 (3'10.5") is open at X = 13.625 to 14.0. |
| W-INT-06 | [13.625, 26.375, 4.000, 4.375] | Solid. Kitchen south wall. |
| W-INT-07 | [14.000, 23.000, 11.375, 11.750] | Ends at X = 23.0. **Kitchen door**: X = 23.000 to 26.000 (3.00 ft). |
| W-INT-08 | [26.000, 26.375, 4.000, 15.000] | Solid. **Lobby-East hallway opening**: Y = 15.000 to 18.875 at X = 26.0 to 26.375. |
| W-INT-09 | [26.000, 26.375, 18.875, 23.250] | Solid. East side of the lobby, west side of the shaft alcove. |
| W-INT-10a | [33.875, 34.250, 0.000, 15.000] | East side of the stairs bay, west side of the garage. The portion south of Y = about 12 is drawn faintly on the plan [M]; keep it solid down to Y = 0. |
| W-INT-10b | [33.875, 34.250, 18.875, 23.250] | West wall of the East washroom. Y = 15.000 to 18.875 is open (East hallway flows through). |
| W-INT-11 | [33.875, 38.750, 18.875, 19.250] | **East washroom door**: X = 38.750 to 41.250 (2.50 ft), opening south into the East hallway. |
| W-INT-12 | [41.250, 41.625, 18.875, 23.250] | Solid. **Storeroom door**: Y = 15.375 to 18.875 (3'6") is open at X = 41.25 to 41.625. |
| W-INT-13 | [41.250, 49.250, 15.000, 15.375] | The plan shows this wall starting directly under W-INT-12 (X = about 41.2 [M]). The garage is therefore open to the East hallway along X = 34.25 to 41.25. |

No other walls exist. In particular there is **no** wall around the shaft (see 7.4), **no** wall between the stairs bay and the East hallway, and **no** wall between the East hallway and the shaft alcove.

---

## 6. Openings Summary (for validation)

All interior openings are bare, with head at `H_DOOR` (7.00 ft) and solid wall above, unless marked "full".

| Opening | Plane | Span | Width |
| :--- | :--- | :--- | :--- |
| Pedestrian GATE | West boundary, X = -0.75 to 0 | Y = 0 to 7.5 | 7.5 ft [M]; wall absent, no lintel |
| GARAGE-GATE | South boundary, Y = -0.75 to 0 | X = 36.5 to 49.25 | 12.75 ft [M]; wall absent, no lintel |
| Bedroom door | Y = 7.5 to 7.875 | X = 10.625 to 13.625 | 3.00 ft |
| Bedroom-Lobby passage | X = 13.625 to 14.0 | Y = 15.0 to 18.875 | 3.875 ft |
| West washroom door | X = 13.625 to 14.0 | Y = 19.25 to 21.625 | 2.375 ft [M] |
| Kitchen door | Y = 11.375 to 11.75 | X = 23.0 to 26.0 | 3.00 ft |
| Lobby-East hallway opening | X = 26.0 to 26.375 | Y = 15.0 to 18.875 | 3.875 ft |
| Stairs bay to East hallway | none (no wall) | X = 26.375 to 33.875 at Y = 15.0 | Full |
| East hallway through W-INT-10 | X = 33.875 to 34.25 | Y = 15.0 to 18.875 | 3.875 ft |
| Garage to East hallway | Y = 15.0 | X = 34.25 to 41.25 | 7.0 ft, full; 1.0 ft step (7.5) |
| East washroom door | Y = 18.875 to 19.25 | X = 38.75 to 41.25 | 2.50 ft |
| Storeroom door | X = 41.25 to 41.625 | Y = 15.375 to 18.875 | 3.50 ft |

---

## 7. Vertical Circulation and Level Changes

### 7.1 Entrance steps (ground to plinth) [M] positions, [A] heights

* Location: Z3, running across Y = 0 to 7.5 (full porch depth), ascending **east** (+X) [A]. The plan has a small arrow-like mark on the steps but no label, so the ascent direction is assumed from the fact that the porch floor lies to the east.
* Four parallel riser lines are drawn at about X = 3.75, 4.55, 5.35, 6.15 [M], so each tread is about **0.8 ft** deep.
* Build as three solid blocks, each spanning Y = 0 to 7.5:
  * Step 1: X = 3.75 to 4.55, top Z = +0.50
  * Step 2: X = 4.55 to 5.35, top Z = +1.00
  * Step 3: X = 5.35 to 6.15, top Z = +1.50
* Porch floor: X = 6.15 to 13.625 at Z = +1.50. Ground-level strip X = 3.25 to 3.75 at Z = 0.00.
* Alternative reading (equal plausibility): the riser lines at 4.5, 5.3, 6.1 are the three risers and the first line is just the wall face extended. That would shift the steps by about 0.75 ft. It does not change the total rise, and it should be confirmed with the owner.

### 7.2 Main staircase (Zone Z9B) [M] geometry, [A] vertical rise

* **West passage** X = 26.375 to 30.125 (3'9", labelled "3'9" W.D" on the plan [P]): ground-level circulation at Z = +1.50 connecting the South hallway (Y = 0) to the Lobby/East hallway (Y = 15). It is **not** under the flight; the flight is in the adjacent lane.
* **Flight lane** X = 30.125 to 33.875 (3'9" [P]).
* **Flight** Y = **4.00 to 13.24** [M], starting level with the south face of the kitchen's south wall. The plan shows about 11 interior tread lines, so **12 treads** of **0.77 ft** (about 9.25") run each.
* Ascent direction: **north** [A]. The plan has no arrow. The foot of the flight is at the south hallway end.
* Vertical rise [A]: 13 equal risers of (12.00 - 1.50) / 13 = **0.8077 ft** (9.7") from Z = +1.50 to the upper floor level `Z_UPPER` = +12.00 (the top of the slab).
  * Tread k (k = 1 to 12) covers Y = 4.00 + 0.77(k - 1) to 4.00 + 0.77k, top Z = 1.50 + 0.8077k. The 13th riser is at Y = 13.24, up to the slab top.
  * Beyond Y = 13.24 the floor is the slab top at Z = +12.00 (upper landing).
* Build each tread as a solid block from Z = 1.50 up to its top (solid RCC-style flight).
* **Warning:** a 9.7" riser with a 9.25" going is steep. It suggests that the real stair has a turn or mid-landing that is drawn on the upper-floor plan, not here. Keep the straight flight unless the owner provides that plan.

### 7.3 Slab cut-out over the stair [A]

* Opening in the slab: X = 30.125 to 33.875, Y = **7.00 to 13.25**. This is where tread 5 onward would hit the slab (headroom of 6.75 ft assumed). The slab is continuous over Y = 0 to 7.0 and over Y = 13.25 to 15.0.

### 7.4 Shaft, Zone Z10 [M]

* The box is drawn with a **thin single line** (no wall thickness) and a faint rotated label that reads about 3'0" x 4'0". Measured bounds: X = 28.0 to 32.0, Y = 19.5 to 22.5. It does **not** touch the north wall (gap about 0.75 ft).
* The plan does not say what it is. Calling it an "OTS ventilation shaft" would be an interpretation.
* **Default build:** floor outline only. Draw a thin raised border (0.1 ft high, 0.1 ft wide) around the rectangle on the floor, no walls, slab continuous above.
* **Option B (only if confirmed open-to-sky):** also cut a 4.0 x 3.0 ft hole in the slab at the same XY.

### 7.5 Garage floor and threshold [A]

* Garage floor Z = 0.00 at Y = 0 sloping linearly to Z = +0.50 at Y = 15.0 (a rise of only 0.5 ft over 15 ft, about 1.9 degrees).
* At Y = 15.0 there is a **1.00 ft step up** to the East hallway (Z = +1.50) across X = 34.25 to 41.25. Along X = 41.25 to 49.25 the wall W-INT-13 separates the garage from the storeroom.

---

## 8. Slab / Roof [A]

* Slab footprint: X = 3.25 to 50.00, Y = 0.00 to 24.00 (this follows the exterior walls on the north and east sides and starts at the west edge of the porch), underside at `Z_CEIL`, thickness `T_SLAB`.
* Not covered: Z1 (gate landing, X < 3.25, Y < 7.5) and Z2 (garden, X < 3.25, Y >= 7.5).
* Cut-outs: stair opening (7.3); shaft hole only under Option B (7.4).
* The slab top (Z = +12.00) is also the upper floor level where the stair arrives.
* No parapet, beams, sunshades, or overhang are specified. Do not add them.

---

## 9. Fixtures and Furniture

**None.** There is no kitchen countertop. The two inner kitchen lines that look like one are measurement lines, erased in the modified image. The plan shows no counter, no sanitary fixtures and no doors or windows.

---

## 10. Blueprint Artifacts to Ignore (lines and marks that are not geometry)

The raw plan (`ground-floor`) has dimension lines that were erased in the modified image (`groundfloor-modified`, where they appear as blurred patches). Do **not** build walls for any of them:

1. Horizontal line across the middle of the bedroom (the `10'-0"` label).
2. Vertical line east of the entrance steps in the porch (the `7'-6"` label).
3. The vertical `11'-6"` line and the horizontal `12'-0"` line inside the lobby.
4. Horizontal line across the middle of the garage (the `15'-0"` label).
5. The two inner lines in the kitchen: a vertical line at about X = 16.5 and a horizontal line at about Y = 6.8. They are not a counter.
6. The horizontal `7'-6"` line across the top of the stairs bay (at about Y = 14.5).
7. The faint "3'9" W.D" note and the scribbled marks beside the stairs (at about X = 28.5, Y = 5 to 12). They are text, not walls.
8. The dotted vertical line with the `4'0"` label just south of the kitchen's south-east corner (a dimension of the south hallway).
9. The arrow-headed dimension-style line along the south edge (see the warning in 5.1).
10. All typed room labels ("bedroom", "kitchen", ...) and the title "Ground Floor". They name rooms; they are not geometry.

---

## 11. Self-Check for the Builder (before finishing)

1. Box counts match section 13.9 (4 exterior wall boxes, 14 interior wall boxes, 8 lintels). Nothing else.
2. No wall box overlaps a zone's clear floor area (corner overlaps between wall boxes are fine).
3. The three N-S bays each sum to 23.25 ft, and the E-W chain ends at X = 49.25.
4. Every wall in the garage, the porch and the steps area reaches Z = 0.00 at its base.
5. Every opening in section 6 is open, and every door-less gap has no leaf.
6. The 13th riser at Y = 13.24 reaches the slab top (Z = +12.00), and the slab opening is clear above the flight.
7. No windows, furniture, counters, railings or doors were added.

---

## 12. Assumptions Register and Items to Confirm With the Plan's Author

Ranked by how much they would change the model:

1. **Z heights** (plinth +1.50, ceiling +11.50, slab 0.5, garage slope 0 to 0.5, 1.0 ft threshold step): none are on a 2D plan. Confirm from elevations or sections.
2. **South wall end** (X = 36.5 vs about 26): which of the two south-edge lines is the wall?
3. **Stair**: ascent direction, the real floor-to-floor rise, and whether there is a turn or landing off-plan. The straight 13-riser flight is steep.
4. **Shaft** (Z10): purpose, open-to-sky or not, and whether it has walls.
5. **Wall thickness**: 9" exterior and 4.5" interior. The interior value fits the chains; the exterior value is a convention.
6. **Garden/boundary wall height**: the model uses `Z_CEIL` (11.5 ft). A garden boundary wall is often lower (about 6 ft).
7. **Entrance step positions**: first riser at X = 3.75 or 4.5 (7.1).
8. **Door/opening head height** (`H_DOOR` = 7.0) and whether the wider gaps (3.875 ft passages) are arches or full-height openings.
9. **Plan north** is assumed to be the top of the sheet.

---

## 13. Build Guide (step-by-step construction recipe)

This section turns sections 4 to 8 into an exact list of solid boxes. Build in the order given. If this section and an earlier section ever disagree, sections 4 to 8 win and this section has an error.

### 13.1 Conventions

* Every solid is an axis-aligned box written `[xmin, xmax, ymin, ymax, zmin, zmax]` in feet. Do not rotate, bevel or round anything.
* Union all solids into one model. Overlaps between a wall and a plinth block are intended (walls start at Z = 0.00 inside the plinth fill).
* The wall boxes here are the section 5 boxes trimmed so that no two walls overlap (W-EXT-WEST and W-EXT-EAST stop at Y = 23.25; W-INT-02a starts at X = 3.625; W-INT-05 and W-INT-08 start at Y = 4.375; W-INT-11a starts at X = 34.25). The union is identical to section 5.
* **Doorways are voids, not objects.** Every interior opening is a clear gap from the local floor (Z = 1.50) up to Z = 8.50. Above it, a **lintel** box fills the wall up to Z = 11.50. Below Z = 1.50 the plinth block fills the gap, so no wall box is needed there.
* **Axis mapping.** The spec is Z-up and right-handed (Blender, Unreal-style Z-up, CAD). For a Y-up engine such as three.js use `engine_x = X`, `engine_y = Z`, `engine_z = -Y`, so plan north points to engine -z. Do not mirror the plan.
* No materials, textures, doors, windows or furniture are specified. Any colour is a presentation choice (13.10) and carries no meaning.

### 13.2 Step 1: ground slab

| ID | Box | Note |
| :--- | :--- | :--- |
| G0 | `[-0.750, 50.000, -0.750, 24.000, -0.500, 0.000]` | Base slab under the whole plot so the garden, gate landing and garage sit on something. Its 0.50 ft thickness is [A] and only affects looks. |

### 13.3 Step 2: plinth blocks, entrance steps, garage floor

Four blocks make the whole raised floor (Z = 0.00 to 1.50). Together they cover Z4 to Z9, Z11 to Z13 and Z15 plus the porch and the wall footprints between them, and they stay clear of the garden and the garage.

| ID | Box | Covers |
| :--- | :--- | :--- |
| P1 | `[3.250, 34.250, 7.500, 23.250, 0.000, 1.500]` | Bedroom, West washroom, Lobby, kitchen north part, stairs bay north part, shaft alcove, bedroom door and passage thresholds |
| P2 | `[13.625, 34.250, 0.000, 7.500, 0.000, 1.500]` | South hallway, kitchen south wall, stairs bay foot (Y = 0 to 7.5) |
| P3 | `[6.150, 13.625, 0.000, 7.500, 0.000, 1.500]` | Porch floor east of the steps |
| P4 | `[34.250, 49.250, 15.000, 23.250, 0.000, 1.500]` | East hallway east part, East washroom, Storeroom, their thresholds |

Entrance steps (ascend east, section 7.1). Each block spans the full porch depth Y = 0 to 7.5:

| ID | Box | Top Z |
| :--- | :--- | :--- |
| S1 | `[3.750, 4.550, 0.000, 7.500, 0.000, 0.500]` | 0.50 |
| S2 | `[4.550, 5.350, 0.000, 7.500, 0.000, 1.000]` | 1.00 |
| S3 | `[5.350, 6.150, 0.000, 7.500, 0.000, 1.500]` | 1.50 |

Garage floor (Z14), the only sloped solid. Build it as a **wedge**: extrude the triangle below along X from 34.250 to 49.250.

| ID | Profile in the (Y, Z) plane | Extrusion |
| :--- | :--- | :--- |
| GF | (0.000, 0.000), (15.000, 0.000), (15.000, 0.500) | X = 34.250 to 49.250. Top surface Z = Y / 30. At Y = 15 the wedge is 0.50 ft tall, so the step up to the East hallway slab block P4 is exactly 1.00 ft. |

### 13.4 Step 3: exterior walls

All four run from Z = 0.00 to 11.50. No window openings.

| ID | Box | Note |
| :--- | :--- | :--- |
| W-EXT-N | `[-0.750, 50.000, 23.250, 24.000, 0.000, 11.500]` | North wall, full width. |
| W-EXT-E | `[49.250, 50.000, 0.000, 23.250, 0.000, 11.500]` | East wall. |
| W-EXT-W | `[-0.750, 0.000, 7.500, 23.250, 0.000, 11.500]` | West wall. Absent for Y = 0 to 7.5: that gap is the pedestrian gate. |
| W-EXT-S | `[-0.750, 36.500, -0.750, 0.000, 0.000, 11.500]` | South wall. Absent for X = 36.5 to 49.25: that gap is the garage gate (confirm, section 5.1). |

### 13.5 Step 4: interior walls and lintels

Full-height wall boxes (Z = 0.000 to 11.500):

| ID | Box | Note |
| :--- | :--- | :--- |
| W-INT-01 | `[3.250, 3.625, 7.500, 23.250, 0.000, 11.500]` | Garden / house divider; plinth retaining wall. |
| W-INT-02a | `[3.625, 10.625, 7.500, 7.875, 0.000, 11.500]` | Bedroom south wall, west of the bedroom door. |
| W-INT-03 | `[3.625, 14.000, 18.875, 19.250, 0.000, 11.500]` | Bedroom / West washroom divider. |
| W-INT-04a | `[13.625, 14.000, 21.625, 23.250, 0.000, 11.500]` | Stub on the West washroom east side; the door is south of it. |
| W-INT-05 | `[13.625, 14.000, 4.375, 15.000, 0.000, 11.500]` | Bedroom / kitchen / lobby divider, south part. |
| W-INT-06 | `[13.625, 26.375, 4.000, 4.375, 0.000, 11.500]` | Kitchen south wall (full width). |
| W-INT-07a | `[14.000, 23.000, 11.375, 11.750, 0.000, 11.500]` | Kitchen north wall, west of the kitchen door. |
| W-INT-08 | `[26.000, 26.375, 4.375, 15.000, 0.000, 11.500]` | Kitchen east wall. |
| W-INT-09 | `[26.000, 26.375, 18.875, 23.250, 0.000, 11.500]` | Lobby east wall, shaft alcove west wall. |
| W-INT-10a | `[33.875, 34.250, 0.000, 15.000, 0.000, 11.500]` | Stairs bay east wall / garage west wall. |
| W-INT-10b | `[33.875, 34.250, 18.875, 23.250, 0.000, 11.500]` | East washroom west wall. |
| W-INT-11a | `[34.250, 38.750, 18.875, 19.250, 0.000, 11.500]` | East washroom south wall, west of its door. |
| W-INT-12a | `[41.250, 41.625, 18.875, 23.250, 0.000, 11.500]` | East washroom / Storeroom divider. |
| W-INT-13 | `[41.250, 49.250, 15.000, 15.375, 0.000, 11.500]` | Storeroom south wall. |

Lintels (Z = 8.500 to 11.500). Each sits above one doorway whose clear opening is Z = 1.500 to 8.500:

| ID | Box | Doorway below it | Clear width |
| :--- | :--- | :--- | :--- |
| W-INT-02L | `[10.625, 13.625, 7.500, 7.875, 8.500, 11.500]` | Bedroom door | 3.000 |
| W-INT-04L | `[13.625, 14.000, 19.250, 21.625, 8.500, 11.500]` | West washroom door | 2.375 |
| W-INT-05L | `[13.625, 14.000, 15.000, 18.875, 8.500, 11.500]` | Bedroom-Lobby passage | 3.875 |
| W-INT-07L | `[23.000, 26.000, 11.375, 11.750, 8.500, 11.500]` | Kitchen door | 3.000 |
| W-INT-08L | `[26.000, 26.375, 15.000, 18.875, 8.500, 11.500]` | Lobby-East hallway opening | 3.875 |
| W-INT-10L | `[33.875, 34.250, 15.000, 18.875, 8.500, 11.500]` | East hallway through the stairs/garage wall | 3.875 |
| W-INT-11L | `[38.750, 41.250, 18.875, 19.250, 8.500, 11.500]` | East washroom door | 2.500 |
| W-INT-12L | `[41.250, 41.625, 15.375, 18.875, 8.500, 11.500]` | Storeroom door | 3.500 |

Open boundaries that get **no** wall and no lintel: the pedestrian gate, the garage gate, the line Y = 15.0 between X = 34.25 and 41.25 (garage to East hallway), the line Y = 18.875 between X = 26.375 and 33.875 (East hallway to shaft alcove), and the line X = 26.375 to 33.875 at Y = 15.0 (stairs bay to East hallway).

### 13.6 Step 5: staircase

Twelve solid blocks, each X = 30.125 to 33.875, starting at Z = 1.500. Run 0.770 ft per tread, riser 0.8077 ft, 13th riser at Y = 13.240 up to the slab top (Z = 12.000).

| Tread | Y min | Y max | Top Z | Box |
| :--- | :--- | :--- | :--- | :--- |
| T01 | 4.000 | 4.770 | 2.308 | `[30.125, 33.875, 4.000, 4.770, 1.500, 2.308]` |
| T02 | 4.770 | 5.540 | 3.115 | `[30.125, 33.875, 4.770, 5.540, 1.500, 3.115]` |
| T03 | 5.540 | 6.310 | 3.923 | `[30.125, 33.875, 5.540, 6.310, 1.500, 3.923]` |
| T04 | 6.310 | 7.080 | 4.731 | `[30.125, 33.875, 6.310, 7.080, 1.500, 4.731]` |
| T05 | 7.080 | 7.850 | 5.538 | `[30.125, 33.875, 7.080, 7.850, 1.500, 5.538]` |
| T06 | 7.850 | 8.620 | 6.346 | `[30.125, 33.875, 7.850, 8.620, 1.500, 6.346]` |
| T07 | 8.620 | 9.390 | 7.154 | `[30.125, 33.875, 8.620, 9.390, 1.500, 7.154]` |
| T08 | 9.390 | 10.160 | 7.962 | `[30.125, 33.875, 9.390, 10.160, 1.500, 7.962]` |
| T09 | 10.160 | 10.930 | 8.769 | `[30.125, 33.875, 10.160, 10.930, 1.500, 8.769]` |
| T10 | 10.930 | 11.700 | 9.577 | `[30.125, 33.875, 10.930, 11.700, 1.500, 9.577]` |
| T11 | 11.700 | 12.470 | 10.385 | `[30.125, 33.875, 11.700, 12.470, 1.500, 10.385]` |
| T12 | 12.470 | 13.240 | 11.192 | `[30.125, 33.875, 12.470, 13.240, 1.500, 11.192]` |

Do not add handrails, stringers or a landing: above Y = 13.240 the floor is the slab itself.

### 13.7 Step 6: slab

Slab top is Z = 12.000. The stair opening is X = 30.125 to 33.875, Y = 7.000 to 13.250, and is built by using four boxes that leave it out:

| ID | Box |
| :--- | :--- |
| SL1 | `[3.250, 30.125, 0.000, 24.000, 11.500, 12.000]` |
| SL2 | `[33.875, 50.000, 0.000, 24.000, 11.500, 12.000]` |
| SL3 | `[30.125, 33.875, 0.000, 7.000, 11.500, 12.000]` |
| SL4 | `[30.125, 33.875, 13.250, 24.000, 11.500, 12.000]` |

Nothing covers the garden (X < 3.25) or the gate landing. If the shaft is confirmed open-to-sky (section 7.4, option B), subtract the box `[28.000, 32.000, 19.500, 22.500, 11.500, 12.000]` from the slab after building it.

### 13.8 Step 7: shaft marker (default build)

A thin raised border on the floor, no walls (section 7.4). Each box is 0.1 ft wide and 0.1 ft tall:

| ID | Box |
| :--- | :--- |
| SH-S | `[28.000, 32.000, 19.500, 19.600, 1.500, 1.600]` |
| SH-N | `[28.000, 32.000, 22.400, 22.500, 1.500, 1.600]` |
| SH-W | `[28.000, 28.100, 19.600, 22.400, 1.500, 1.600]` |
| SH-E | `[31.900, 32.000, 19.600, 22.400, 1.500, 1.600]` |

### 13.9 Step 8: verification (do not skip)

**Counts.** If any count differs, a piece is missing or extra.

| Group | Count |
| :--- | :--- |
| Ground slab | 1 |
| Plinth blocks P1-P4 | 4 |
| Entrance step blocks | 3 |
| Garage wedge | 1 |
| Exterior walls | 4 |
| Interior full-height walls | 14 |
| Lintels | 8 |
| Stair treads | 12 |
| Slab boxes | 4 |
| Shaft marker boxes | 4 |
| **Total solids** | **55** |

**Clear floor areas** (width x depth from section 4, in sq ft). Check each room's empty floor against it:

| Zone | Area | Zone | Area | Zone | Area |
| :--- | :--- | :--- | :--- | :--- | :--- |
| Z1 Gate landing | 24.38 | Z2 Garden | 51.19 | Z3 Porch + steps | 77.81 |
| Z4 Bedroom | 110.00 | Z5 West washroom | 40.00 | Z6 South hallway | 51.00 |
| Z7 Kitchen | 84.00 | Z8 Lobby | 138.00 | Z9A West passage | 56.25 |
| Z9B Flight lane | 56.25 | Z11 East hallway | 57.64 | Z12 East washroom | 28.00 |
| Z13 Storeroom | 60.05 | Z14 Garage | 225.00 | Z15 Shaft alcove | 32.81 |

**Walk test.** A person 2.5 ft wide and 6.5 ft tall must be able to walk each route below with no wall in the way. Waypoints are (X, Y) in feet; the floor is Z = 1.50 except on the landing, steps and garage.

| # | Route | Waypoints |
| :--- | :--- | :--- |
| 1 | Gate landing to porch to bedroom | (1.6, 3.75) -> (8.0, 3.75) -> (12.1, 3.75) -> (12.1, 9.0) -> (8.0, 12.0) |
| 2 | Bedroom to lobby | (8.0, 12.0) -> (8.0, 17.0) -> (13.8, 17.0) -> (20.0, 17.0) |
| 3 | Lobby to kitchen | (20.0, 17.0) -> (24.5, 17.0) -> (24.5, 10.5) -> (20.0, 8.0) |
| 4 | Lobby to West washroom | (20.0, 17.0) -> (20.0, 20.5) -> (13.8, 20.5) -> (8.0, 21.0) |
| 5 | Porch to south hallway to stairs bay to East hallway | (12.1, 3.75) -> (12.1, 2.0) -> (28.0, 2.0) -> (28.0, 16.9) -> (36.0, 16.9) |
| 6 | East hallway to garage | (36.0, 16.9) -> (36.0, 10.0) |
| 7 | East hallway to East washroom | (40.0, 16.9) -> (40.0, 19.06) -> (40.0, 21.5) |
| 8 | East hallway to storeroom | (36.0, 16.9) -> (41.44, 16.9) -> (45.0, 19.0) |
| 9 | Garage to street | (42.0, 10.0) -> (42.0, -1.5) |
| 10 | Lobby to East hallway | (24.5, 17.0) -> (30.0, 17.0) -> (36.0, 16.9) |

**Blocked test.** A straight line between each pair below must hit a wall:

| Pair | Wall that blocks it |
| :--- | :--- |
| Porch (8, 4) to kitchen (20, 8) | W-INT-05 |
| Kitchen (20, 8) to south hallway (20, 2) | W-INT-06 |
| Bedroom (8, 12) to garden (1.5, 12) | W-INT-01 |
| Garage (40, 10) to storeroom (45, 19) | W-INT-13 |
| East washroom (36, 21) to East hallway (36, 17) | W-INT-11a |
| Kitchen (20, 8) to lobby (20, 17) | W-INT-07a |
| West washroom (8, 21) to bedroom (8, 12) | W-INT-03 |
| Stairs bay (28, 10) to garage (40, 10) | W-INT-10a |
| Street (35, -2) to garage west part (35, 5) | W-EXT-S |

**Vertical checks.**

* Standing at (28, 10) on the west passage (Z = 1.50), the ceiling is at Z = 11.50 and the clear height is 10.00 ft.
* The porch floor at (8, 3) is Z = 1.50 and the gate landing at (1.6, 3.75) is Z = 0.00: three risers of 0.50 ft, treads 0.8 ft.
* The garage floor at (42, 0) is Z = 0.00 and at (42, 15) is Z = 0.50. Just north of it, the East hallway floor at (42, 15.5) is Z = 1.50.
* At the top of the flight, tread 12 (Z = 11.192) is 0.808 ft below the slab top (Z = 12.000) at Y = 13.24.
* Above tread 5 (Y = 7.08 to 7.85) there is no slab: the opening is open from Z = 11.50 up.
* The top of every doorway is Z = 8.50, which gives 7.00 ft of clear height above the Z = 1.50 floor.

**Grid check (programmatic).** Sample the plan on a 0.125 ft grid over X = 3.25 to 50.0, Y = 0 to 24.0. Every cell must lie inside exactly one of: a wall or lintel footprint, or a zone in section 4 (the only permitted double count is the doorway strip X = 33.875 to 34.25, Y = 15.0 to 18.875, which is both lintel W-INT-10L and part of Z11). No cell may be empty.

### 13.10 Optional colours (presentation only, not part of the plan)

| Element | Suggested colour |
| :--- | :--- |
| Exterior walls | `#d9d4c7` |
| Interior walls and lintels | `#ece8dd` |
| Plinth, steps, stair | `#b9b2a3` |
| Garage wedge and ground slab | `#8f8b83` |
| Slab | `#c9c4b8` |
| Shaft marker | `#c0392b` |

### 13.11 Common mistakes to avoid

1. Adding windows, doors, railings or furniture. None are in the plan.
2. Building doorways as thin gaps up to the ceiling. They must be 7.00 ft tall with a lintel above.
3. Starting interior walls at Z = 1.50. They start at Z = 0.00 (they sit beside the garage, steps and garden).
4. Forgetting the 1.00 ft step at Y = 15 between the garage and the East hallway.
5. Putting the stair top at Z = 11.50. It reaches the slab top at Z = 12.00.
6. Letting the slab cover the stair opening, or leaving the opening too long. It is Y = 7.0 to 13.25 only.
7. Mirroring the plan or swapping X and Y. East is +X, north is +Y; north is the top of the sheet.
8. Building the kitchen counter or the lobby and kitchen inner lines as walls. They are not in the plan.
9. Filling the gate gap (Y = 0 to 7.5 on the west) or the garage gate (X = 36.5 to 49.25 on the south) with wall.
10. Treating section 14 as instructions. It is commentary.

---

## 14. Design-Sense Review (commentary for the human; the builder must NOT act on this)

Sections 4 to 8 check that the geometry is consistent with the plan. This section asks a different question: does the plan work as a house? Each item is marked **Sensible**, **Questionable** or **Unknown**, with the evidence. None of it changes the model. If the owner confirms a change, edit sections 4 to 8 and not this section.

### 14.1 Circulation and access

| Check | Verdict | Evidence |
| :--- | :--- | :--- |
| Every room is reachable | Sensible | Street -> gate -> porch steps -> south hallway -> stairs bay west passage -> East hallway. From the East hallway: garage, storeroom, East washroom, and (through the opening at X = 26.0 to 26.375) the lobby. From the lobby: kitchen and West washroom. The bedroom opens from the porch and from the lobby passage. |
| Two ways out of the building | Sensible | The pedestrian gate (via the porch) and the garage gate. |
| Kitchen has a single door | Sensible | Kitchen door opens to the lobby only. All other kitchen walls are solid, so there is no through-traffic across the kitchen. |
| Garage opens into the house without a door | Questionable | The garage-to-East-hallway connection is 7.0 ft wide, full height, with only a step. The plan shows it, so keep it, but it is unusual for security and fumes. A door line may exist that was never drawn. |
| Bedroom has two entrances, one of them a 3.875 ft open passage to the lobby | Questionable | Plan-faithful, but the bedroom has no privacy from the lobby unless a door or curtain is drawn elsewhere. |
| Washrooms are not attached to the bedroom | Unknown | The bedroom/West washroom wall (W-INT-03) is solid. The West washroom is entered from the lobby, not the bedroom. This is how the plan reads. |

### 14.2 Light and ventilation

* **No windows or ventilators appear anywhere on the plan** (Questionable). Section 1 tells the builder not to add any, which is faithful to the plan but probably not how the real house is. A plan commonly omits them, so this is "missing information", not "design error".
* The **kitchen has no exterior wall at all** (it is surrounded by the south hallway, the bedroom wall, the lobby and the stairs bay). Without a window or duct it would have no daylight and no cooking-smoke outlet. Unknown whether a window onto the stairs bay or the lobby exists.
* The shaft (Z10) is the only drawn candidate for ventilation, but it sits in the north alcove at X = 28 to 32 and is not adjacent to the kitchen or either washroom, so **it cannot be assumed to ventilate anything** (Unknown).
* The washrooms and the storeroom each have a north exterior wall where a ventilator could go; the bedroom's west neighbour is the open garden (Z2), the natural place for its window.
* Action for the owner: ask where windows and ventilators go. Until then the model stays windowless on purpose.

### 14.3 Vertical design

| Item | Verdict | Evidence |
| :--- | :--- | :--- |
| Plinth 1.50 ft above street with 3 steps of 0.50 ft | Sensible | Raises the floor above street flooding and damp. A 6" riser is comfortable. |
| Step treads of 0.8 ft (about 9.6") | Sensible | A little shallow compared with the usual 10", but fine for an entrance. |
| Ceiling 10 ft clear | Sensible | High but common for warm climates. |
| Garage floor falling from the house to the street (+0.50 at Y = 15, 0.00 at Y = 0) | Sensible | Water drains out through the garage gate rather than toward the house. |
| 1.00 ft step at the garage/East hallway threshold | Questionable | A 12" riser is tall for a daily step, and 7 ft of it would be a hazard. Likely a ramp or two steps in reality. It is an assumption (section 7.5), not a plan value. |
| Straight flight of 13 risers at 9.7" | Questionable | Steeper than a comfortable stair. Probably the real stair turns or has a landing off-plan (see section 12, item 3). |
| Stair headroom | Sensible | Using the 6.75 ft headroom rule, tread 4 (Z = 4.73) leaves 6.77 ft under the slab, and tread 5 does not, so the slab opening begins at tread 5 (Y = 7.08). This part is reasoning, not tracing. |
| Slab opening starts at Y = 7.0 and ends at Y = 13.25 | Sensible | It leaves 1.75 ft of slab (Y = 13.25 to 15.0) as the upper landing. |

### 14.4 Openings and sizes

* Door widths are 3.0 ft (bedroom, kitchen), 3.5 ft (storeroom), 2.5 ft (East washroom) and 2.375 ft (West washroom). The last one is the odd one out. It is a measured value with +/- 0.25 ft, and 2.5 ft is the likelier design value. It is kept at the measured value so that the model follows the plan; if the owner confirms 2.5 ft, move the stub start in W-INT-04 from Y = 21.625 to 21.75.
* Wide passages (3.875 ft) are drawn as plain gaps with no door lines, so they may be arches or door-less openings. The builder uses a 7.0 ft head for all interior openings, which is an assumption (section 12, item 8).
* The garage gate opening is 12.75 ft wide for a 15 ft garage, which comfortably fits a car with the 2.25 ft wall stub on one side. Sensible.

### 14.5 Structure

* The plan shows walls only. A house with 4.5" interior walls, a 10 ft ceiling and spans such as the garage (15 x 15 ft) and the lobby (12 x 11.5 ft) is almost certainly **framed with columns and beams** (RCC), with the walls as infill. The columns and beams are not drawn, so the model has none, and the builder must not add them.
* **W-INT-01 is a 4.5" wall retaining a 1.5 ft earth fill** under the bedroom and West washroom. On its own that is weak. In reality there is probably a plinth beam or a thicker wall. The model keeps the drawn thickness (Questionable).
* The 9" exterior wall is a common convention, not a plan measurement (section 2).

### 14.6 Layout logic

* **Plumbing:** the two washrooms are far apart (West at X = 3.6 to 13.6, East at X = 34.3 to 41.3) and the kitchen is not next to either. That means at least two separate drain stacks. Not a modelling problem, but it explains why there is a shaft.
* **Wet and dry rooms:** the West washroom shares a wall with the bedroom (W-INT-03). Fine in most houses, but noise and damp are the usual issues there.
* **Daily flow:** the kitchen, the lobby and the stairs are all within one open zone, and the main living space (lobby) has the bedroom, kitchen and stairs on its edges. This reads like a sensible hub arrangement. Sensible.

### 14.7 What to do with this section

| Question for the owner | Affects |
| :--- | :--- |
| Where are the windows and ventilators? | Adds openings to exterior walls and possibly the shaft purpose |
| Is the garage step 1.0 ft, or is it a ramp or two steps? | Section 7.5 |
| Does the stair turn or have a landing? | Section 7.2 and 7.3 |
| Are there columns and beams, and what is the real plinth wall? | New structural elements if wanted |
| Is the West washroom door 2.375 ft or 2.5 ft? | W-INT-04 stub position |
