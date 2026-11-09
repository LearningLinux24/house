# First Floor: Fit-Out, Openings and Interior Specification (supplement)

## 0. Purpose, precedence and builder instruction

This file supplements `first_floor_3d_simulation_specification.md` (the **base file**), in the same way `ground_floor_3d_fitout_and_interior_specification.md` supplements the ground floor. The base file fixes the structure of the first floor: walls, floor plate, stair, roof slab. This file adds everything a real Indian house has on top of that structure and that the 2D plan does not show: windows, doors, railings, finishes, fixtures, furniture and lighting. It also answers every open question in the base file (its sections 12 and 14) with the most common choice for a typical Indian house.

> **System Instruction for 3D Builder LLM:** First build the ground floor completely (its base file and its fit-out file), then the first-floor base file (its section 13 recipe). Then apply this file in the order of section 12. This file **replaces** the base file's rule "do not add windows, doors, furniture, railings or fixtures": you MUST add every item listed here with the exact coordinates given, and you MUST NOT add anything that is not listed. Do not move, resize, rename or omit items. Where this file overrides a base-file box (section 3), the override wins. Everything is in feet, Z-up, with the same axes and datum as the other files. The first-floor level is Z = 12.00 and the underside of the roof slab is Z = 22.00.

**Precedence:** (1) section 3 overrides, (2) this file, (3) the base file, in that order.

**Tags.** **[IN]** = typical Indian residential practice (an assumption, not read from the plan; North India, e.g. Uttar Pradesh, hot climate, RCC-framed brick construction). **[P] [D] [M] [A]** keep the meaning they have in the base file. Every [IN] value can be replaced in one place if the owner says otherwise.

## 1. Conventions

* Boxes are `[xmin, xmax, ymin, ymax, zmin, zmax]` in **absolute** feet (not heights above the floor). The first-floor floor is Z = 12.00 everywhere (balconies included).
* "Void" boxes are subtracted from walls. "Solid" boxes are added.
* All furniture sits directly on the floor plate. Nothing floats unless it is wall-mounted (those items state their height).
* Item names give the real-world size so the builder can sanity-check the box. Real-world heights above the floor are (Z - 12.00).
* Wet-room fittings use the same sizes and heights as the ground floor.

## 2. Decision Register: answers to the open questions

Each row answers an open question from base-file section 12 or section 14.

| # | Question | Answer used | Basis |
| :--- | :--- | :--- | :--- |
| 1 | How is the balcony entered? | Two ways. (a) A 2.625 ft glazed door in the kitchen's south wall at its south-east corner (X 11.0 to 13.625): this turns **Option C of the base file ON**, and the heavy black bar the owner drew there is read as the door leaf. (b) A 2.75 ft glazed door from the master bedroom (door DF8, X 0.5 to 3.25 in the balcony's north wall). | (a) [IN] the plan calls the balcony "W.D" (wash and dry), a utility balcony off the kitchen. (b) the owner asked for it |
| 2 | Master bedroom door to the balcony | Yes: door DF8, hinged at its west jamb, opening into the master bedroom. The owner's thin black line on that wall is read as this door. The master wardrobe moves east to make room (MB-08). | The owner asked for it |
| 3 | Balcony outer walls | 3.0 ft brick parapet with a 1.0 ft MS railing on top (**Option D of the base file ON**). The rest of the south and west walls stay full height. | [IN] standard balcony |
| 4 | Balcony floor level | Flush with the room floor (Z = 12.00), with the floor sloped 1:100 to a drain | [IN] a 2-4" drop is usual but not on the plan, and it would change the geometry |
| 5 | Basin niche south side | Open to the lobby. The thin line is ignored (as in the base file). One wall-hung basin on a pedestal with a mirror, against the north wall. | [IN] a wash-basin niche beside the dining space is standard |
| 6 | Windows: where they can go | On the **south** (street), the **west** (street) and the **north** (rear) exterior walls. **None on the east wall.** The east and north sides are on the plot boundary shared with neighbours, so the north has only the child bedroom window and two ventilators. | [IN] the ground floor shows the plot has gate access on the south and west |
| 7 | Window type | Aluminium sliding windows with 5 mm glass; MS safety grills on every window that faces outside; 4 x 4 ft (sill 3 ft above floor), or 3 x 3 ft where the wall is short or there is a platform below | [IN] standard |
| 8 | Door heads and sizes | 7 ft clear height. Flush teak-veneer doors for the rooms (3.25, 3.0, 3.5 and 2.5 ft as measured), PVC doors for bathrooms, a glazed aluminium door to the balcony. No arches. The plain gaps (niche, gallery, stair bay) stay open. | [IN] |
| 9 | Opening sizes | Kept exactly as the base file (measured). Not rounded to 3.0 ft. | Keeps the model faithful to the plan |
| 10 | Upper stair | Kept as the base file. Finishes and railings added. The stair-head cover (mumty), terrace parapet and water tank are above the drawn floor and **not** added. | The terrace is not drawn, the header of the base file says so |
| 11 | Void over the ground flight | Guard railing 3.0 ft high on its south and west edges | [IN] a floor opening needs a guard |
| 12 | Shaft | Same as the ground floor: an open-to-sky service/ventilation duct, 4.0 x 3.0 ft clear, centred on (30.0, 21.0), 4.5" brick walls, MS jali cap at the roof-slab top | [IN] it stacks with the ground-floor duct and sits between the two bathrooms |
| 13 | Bathrooms | Western WC, pedestal basin, mirror, geyser, shower (no curtain), exhaust fan in the ventilator, floor drain | [IN] same as the ground floor |
| 14 | Kitchen | L-shaped granite platform (the drawn lines), double-bowl sink under the west window, 4-burner hob under an exhaust fan that vents to the balcony, fridge, wall cabinets | [IN] |
| 15 | Lobby use | Living and dining: three-seat sofa, centre table, TV unit, 6-seat dining table | [IN] |
| 16 | Child bedroom | Single bed, desk, wardrobe, bookshelf | [IN] |
| 17 | Mandir | Marble platform with a wooden temple unit against the east wall, two brass lamps, a prayer mat. Marble floor. | [IN] a prayer room |
| 18 | Hallway fixtures | Vanity with basin and mirror (the drawn "basin" box), front-loading washing machine (the drawn "washing machine" box) | The plan labels both |
| 19 | Climate equipment | Ceiling fans, LED lights, exhaust fans. No air conditioning, no heaters, no chimney | [IN] same as the ground floor |
| 20 | Structure | RCC frame assumed but **not modelled** (columns and beams are hidden in walls and slab). Do not add any. Same reason as the ground floor. | [IN] |

## 3. Geometry Overrides to the Base File

Apply these before anything else. Boxes not listed here stay exactly as in the base file.

| ID | Change | Boxes |
| :--- | :--- | :--- |
| OF1 | Balcony door ON (base Option C) | F-INT-04 becomes `[3.250, 11.000, 4.000, 4.375, 12.000, 22.000]`. Add lintel F-LIN-07 `[11.000, 13.625, 4.000, 4.375, 19.000, 22.000]`. The opening is X 11.0 to 13.625, 12.00 to 19.00 |
| OF2 | Balcony parapet (base Option D ON). Split two exterior walls | F-EXT-W becomes F-EXT-W-LOW `[-0.750, 0.000, 0.000, 11.750, 12.000, 15.000]` and F-EXT-W-UP `[-0.750, 0.000, 11.750, 23.250, 12.000, 22.000]`. F-EXT-S becomes F-EXT-S-LOW `[-0.750, 14.000, -0.750, 0.000, 12.000, 15.000]` and F-EXT-S-UP `[14.000, 50.000, -0.750, 0.000, 12.000, 22.000]` |
| OF3 | Shaft becomes a duct. **Do not build the base file's shaft marker (13.8).** | DT-F-S `[27.625, 32.375, 19.125, 19.500, 12.000, 22.500]`, DT-F-N `[27.625, 32.375, 22.500, 22.875, 12.000, 22.500]`, DT-F-W `[27.625, 28.000, 19.500, 22.500, 12.000, 22.500]`, DT-F-E `[32.000, 32.375, 19.500, 22.500, 12.000, 22.500]`. Subtract the clear box `[28.000, 32.000, 19.500, 22.500, 22.000, 22.500]` from the roof slab. Add the jali cap DT-F-CAP `[28.000, 32.000, 19.500, 22.500, 22.400, 22.500]` (MS flat-bar grid, bars 0.08 ft wide at 0.33 ft centres). The matching floor-plate hole `[28.000, 32.000, 19.500, 22.500, 11.500, 12.000]` already comes from the ground-floor fit-out |
| OF4 | The base file's four fixture boxes are replaced by detailed items | **Do not build** FX-KT-W, FX-KT-S, FX-BASIN, FX-WM. They are replaced by KF-01 to KF-04, HW-01 to HW-02 and HW-06 (same footprints and heights) |
| OF6 | Master bedroom door to the balcony (door DF8) | F-INT-02 becomes F-INT-02-W `[0.000, 0.500, 11.375, 11.750, 12.000, 22.000]` and F-INT-02-E `[3.250, 14.000, 11.375, 11.750, 12.000, 22.000]`. Add lintel F-LIN-08 `[0.500, 3.250, 11.375, 11.750, 19.000, 22.000]`. The opening is X 0.5 to 3.25, Z 12.00 to 19.00 |
| OF5 | Openings in walls | Subtract the voids of section 4 from the wall boxes they name (or split the walls around them) |

## 4. Windows, Ventilators and Fan Opening

Voids to subtract from walls. Z values are absolute (floor 12.00, so a 3 ft sill is Z = 15.00).

| ID | Opening | Wall | Void box | Size (ft) | Type |
| :--- | :--- | :--- | :--- | :--- | :--- |
| WF-1 | Master bedroom west window | F-EXT-W | `[-0.750, 0.000, 15.500, 19.500, 15.000, 19.000]` | 4.0 x 4.0 | Sliding window, 2 panes, MS grill |
| WF-2 | Kitchen window to the west balcony | F-INT-03 | `[3.250, 3.625, 6.750, 9.750, 15.500, 18.500]` | 3.0 x 3.0 | Sliding window, 2 panes, no grill (opens onto the balcony) |
| WF-3 | Lobby south window, west | F-EXT-S | `[15.000, 19.000, -0.750, 0.000, 15.000, 19.000]` | 4.0 x 4.0 | Sliding window, 2 panes, MS grill |
| WF-4 | Lobby south window, east | F-EXT-S | `[21.000, 25.000, -0.750, 0.000, 15.000, 19.000]` | 4.0 x 4.0 | Sliding window, 2 panes, MS grill |
| WF-5 | Stairs bay south window | F-EXT-S | `[28.000, 32.000, -0.750, 0.000, 15.000, 19.000]` | 4.0 x 4.0 | Sliding window, 2 panes, MS grill |
| WF-6 | Hallway south window | F-EXT-S | `[34.500, 37.500, -0.750, 0.000, 15.500, 18.500]` | 3.0 x 3.0 | Sliding window, 2 panes, MS grill |
| WF-7 | Mandir south window | F-EXT-S | `[43.000, 46.000, -0.750, 0.000, 15.500, 18.500]` | 3.0 x 3.0 | Sliding window, 2 panes, MS grill |
| WF-8 | Child bedroom north window | F-EXT-N | `[43.500, 47.500, 23.250, 24.000, 15.000, 19.000]` | 4.0 x 4.0 | Sliding window, 2 panes, MS grill |
| VF-1 | Bathroom 1 ventilator (north) | F-EXT-N | `[22.800, 24.800, 23.250, 24.000, 17.500, 19.000]` | 2.0 x 1.5 | Ventilator: left half frosted glass, right half exhaust fan (0.75 ft dia) |
| VF-2 | Bathroom 2 ventilator (north) | F-EXT-N | `[35.400, 37.400, 23.250, 24.000, 17.500, 19.000]` | 2.0 x 1.5 | Ventilator: left half frosted glass, right half exhaust fan (0.75 ft dia) |
| EF-F | Kitchen exhaust fan opening (vents to the balcony) | F-INT-04 | `[8.000, 9.000, 4.000, 4.375, 17.500, 18.500]` | 1.0 x 1.0 | Exhaust fan 1.0 ft dia in a square hole, venting to the south balcony |

**Window construction (applies to every window and ventilator void above):**

* Frame: four rails, each 0.12 ft wide and 0.25 ft deep, flush with the room-side face of the wall, material M-ALU-FRAME.
* Sliding panes: two glass boxes 0.02 ft thick, each half the width of the opening (minus the frame), in two parallel tracks 0.06 ft apart, M-GLASS. One pane is shown half-open.
* MS grill (windows marked "MS grill"): on the **outer** face of the wall: the west face (X = -0.75) for WF-1, the south face (Y = -0.75) for WF-3 to WF-7, the north face (Y = 24.0) for WF-8. Vertical bars 0.04 x 0.04 ft at 0.333 ft centres, plus one horizontal flat 0.04 x 0.10 ft at mid height, one at the top and one at the bottom. Material M-GRILL-MS.
* Inner sill: a 0.08 ft thick granite slab (M-GRANITE-STEP) the full wall thickness deep, flush with the room-side face, 0.1 ft wider than the opening on each side.
* No chajjas (sunshades) are added: the walls stand on the plot boundary.
* The ventilators carry a 6-inch exhaust fan in the right half (a 0.75 ft square frame with a 0.5 ft diameter round fan), M-STEEL-SS.

## 5. Doors

There are no gates on this floor (the base file draws the outer walls unbroken).

### 5.1 Doors (closed position)

Each door has two jambs and a head (the frame), plus one leaf. The frame is 0.17 ft wide on the face and runs the full wall thickness. The leaf is 0.115 ft thick, centred in the wall, with 0.02 ft gaps. Opening heights: floor 12.00, frame head from Z = 18.83 to 19.00, leaf from Z = 12.04 to 18.81.

| ID | Room | Wall opening | Hinge | Opens toward | Leaf material |
| :--- | :--- | :--- | :--- | :--- | :--- |
| DF1 | Master bedroom | Y 11.750 to 15.000 at X 13.625 to 14.000 (3.25 ft) | Y = 11.750 | West (into master bedroom) | M-DOOR-TEAK |
| DF2 | Kitchen | Y 8.375 to 11.375 at X 13.625 to 14.000 (3.0 ft) | Y = 11.375 | West (into kitchen) | M-DOOR-TEAK |
| DF3 | Kitchen to balcony | X 11.000 to 13.625 in F-INT-04 (Y 4.000 to 4.375) (2.625 ft) | X = 13.625 | North (into kitchen) | Glazed aluminium door: M-ALU-FRAME frame ring 0.12 ft wide, two M-GLASS panels 0.02 ft thick |
| DF8 | Master bedroom to balcony | X 0.500 to 3.250 in F-INT-02 (Y 11.375 to 11.750) (2.75 ft) | X = 0.500 | North (into master bedroom) | Glazed aluminium door: M-ALU-FRAME frame ring 0.12 ft wide, two M-GLASS panels 0.02 ft thick |
| DF4 | Bathroom 1 | X 17.625 to 20.125 in F-INT-07 area (Y 18.875 to 19.250) (2.5 ft) | X = 17.625 | North (into bathroom) | M-DOOR-PVC |
| DF5 | Bathroom 2 | X 37.125 to 39.875 in F-INT-12 area (Y 18.875 to 19.250) (2.75 ft) | X = 39.875 | North (into bathroom) | M-DOOR-PVC |
| DF6 | Child bedroom | Y 9.375 to 12.875 at X 39.875 to 40.250 (3.5 ft) | Y = 9.375 | East (into child bedroom) | M-DOOR-TEAK |
| DF7 | Mandir | Y 6.500 to 9.000 at X 39.875 to 40.250 (2.5 ft) | Y = 9.000 | East (into mandir) | M-DOOR-TEAK |

Exact boxes (frame and closed leaf):

| Part | Box |
| :--- | :--- |
| DF1-FJ1 | `[13.625, 14.000, 11.750, 11.920, 12.000, 18.830]` |
| DF1-FJ2 | `[13.625, 14.000, 14.830, 15.000, 12.000, 18.830]` |
| DF1-FH | `[13.625, 14.000, 11.750, 15.000, 18.830, 19.000]` |
| DF1-LEAF | `[13.755, 13.870, 11.940, 14.810, 12.040, 18.810]` |
| DF2-FJ1 | `[13.625, 14.000, 8.375, 8.545, 12.000, 18.830]` |
| DF2-FJ2 | `[13.625, 14.000, 11.205, 11.375, 12.000, 18.830]` |
| DF2-FH | `[13.625, 14.000, 8.375, 11.375, 18.830, 19.000]` |
| DF2-LEAF | `[13.755, 13.870, 8.565, 11.185, 12.040, 18.810]` |
| DF3-FJ1 | `[11.000, 11.170, 4.000, 4.375, 12.000, 18.830]` |
| DF3-FJ2 | `[13.455, 13.625, 4.000, 4.375, 12.000, 18.830]` |
| DF3-FH | `[11.000, 13.625, 4.000, 4.375, 18.830, 19.000]` |
| DF3-LEAF | `[11.190, 13.435, 4.130, 4.245, 12.040, 18.810]` |
| DF4-FJ1 | `[17.625, 17.795, 18.875, 19.250, 12.000, 18.830]` |
| DF4-FJ2 | `[19.955, 20.125, 18.875, 19.250, 12.000, 18.830]` |
| DF4-FH | `[17.625, 20.125, 18.875, 19.250, 18.830, 19.000]` |
| DF4-LEAF | `[17.815, 19.935, 19.005, 19.120, 12.040, 18.810]` |
| DF5-FJ1 | `[37.125, 37.295, 18.875, 19.250, 12.000, 18.830]` |
| DF5-FJ2 | `[39.705, 39.875, 18.875, 19.250, 12.000, 18.830]` |
| DF5-FH | `[37.125, 39.875, 18.875, 19.250, 18.830, 19.000]` |
| DF5-LEAF | `[37.315, 39.685, 19.005, 19.120, 12.040, 18.810]` |
| DF6-FJ1 | `[39.875, 40.250, 9.375, 9.545, 12.000, 18.830]` |
| DF6-FJ2 | `[39.875, 40.250, 12.705, 12.875, 12.000, 18.830]` |
| DF6-FH | `[39.875, 40.250, 9.375, 12.875, 18.830, 19.000]` |
| DF6-LEAF | `[40.005, 40.120, 9.565, 12.685, 12.040, 18.810]` |
| DF7-FJ1 | `[39.875, 40.250, 6.500, 6.670, 12.000, 18.830]` |
| DF7-FJ2 | `[39.875, 40.250, 8.830, 9.000, 12.000, 18.830]` |
| DF7-FH | `[39.875, 40.250, 6.500, 9.000, 18.830, 19.000]` |
| DF7-LEAF | `[40.005, 40.120, 6.690, 8.810, 12.040, 18.810]` |
| DF8-FJ1 | `[0.500, 0.670, 11.375, 11.750, 12.000, 18.830]` |
| DF8-FJ2 | `[3.080, 3.250, 11.375, 11.750, 12.000, 18.830]` |
| DF8-FH | `[0.500, 3.250, 11.375, 11.750, 18.830, 19.000]` |
| DF8-LEAF | `[0.690, 3.060, 11.505, 11.620, 12.040, 18.810]` |

Hardware on every door (both faces): one stainless-steel lever handle 0.40 ft long, 0.08 ft diameter, 3.0 ft above the floor (Z = 15.00) and 0.25 ft from the latch-side jamb; three steel butt hinges 0.30 ft tall on the hinge side at Z = 12.8, 15.5 and 18.2. The balcony doors DF3 and DF8 have a stainless-steel bolt instead of a lever on the balcony face. Door open angle for animation: 90 degrees about the hinge line, opening toward the side given in the table. Default state: closed. When DF8 is open its leaf lies against the west wall of the master bedroom.

The plain gaps (basin niche to lobby, lobby to gallery, stair bay to gallery, gallery to alcove, gallery to hallway) have **no frame, no door and no arch**. Plain plastered returns only.

## 6. Stair, Floor-Opening and Balcony Railings

The stair geometry stays as in the base file (lane A treads U01 to U13, X 26.375 to 29.625). Add only:

### 6.1 Finish and handrail, lane A

* **Finish:** each tread gets a 0.083 ft thick granite overlay on top (M-GRANITE-STEP) with a 0.04 ft nosing overhang at the south edge. Risers are also granite.
* **Handrail:** a stainless-steel round bar 0.13 ft diameter along the east edge of lane A, from P1 = (29.55, 13.625, 15.75) to P2 = (29.55, 4.385, 24.75). It is 3.0 ft above the tread nosing, rises above the roof slab through the roof opening and stops at P2 (which is 2.25 ft above the terrace).
* **Balusters:** 24 stainless-steel posts 0.04 x 0.04 ft at X = 29.55. For i = 0 to 23: Y_i = 13.8175 - 0.385 i; the tread index is k = floor((14.01 - Y_i) / 0.77) + 1; the post runs from Z = 12.00 + 0.75 k up to the handrail underside, Z = 15.75 + (13.625 - Y_i) x 0.974 - 0.065.
* Nothing in the 0.5 ft well, and no railing on lane A's west side (the wall).

### 6.2 Guard rail around the floor opening over the ground flight

Two runs, 3.0 ft high, stainless steel (M-STEEL-SS):

| ID | Run | Posts (0.10 x 0.10 ft, Z 12.00 to 15.00) |
| :--- | :--- | :--- |
| GR-S | South edge of the opening, on the floor plate at Y = 6.90 to 7.00, from X = 30.125 to 33.875 | at X = 30.175, 32.000, 33.825 (box `[X-0.05, X+0.05, 6.900, 7.000, 12.000, 15.000]`) |
| GR-W | West edge of the opening, on the floor plate at X = 30.025 to 30.125, from Y = 7.00 to 13.25 | at Y = 7.05, 10.125, 13.20 (box `[30.025, 30.125, Y-0.05, Y+0.05, 12.000, 15.000]`) |

On each run: a top rail 0.13 ft round bar, centre 3.0 ft above the floor (Z = 14.95), between the end posts; a mid rail 0.06 ft square at Z = 13.50; vertical balusters 0.04 ft square from Z = 12.00 to 14.90 at 0.40 ft centres. The north side of the opening (Y = 13.25) stays open: that is where the ground flight arrives.

### 6.3 Balcony railing (on the parapet of override OF2)

MS (M-GRILL-MS), sitting on the parapet top (Z = 15.00):

| Run | Plane | Posts (0.10 x 0.10 ft, Z 15.00 to 16.00) |
| :--- | :--- | :--- |
| South run | Y = -0.375, X from -0.75 to 14.0 | at X = -0.70, 2.23, 5.16, 8.09, 11.02, 13.95 |
| West run | X = -0.375, Y from -0.75 to 11.75 | at Y = -0.70, 2.40, 5.50, 8.60, 11.70 |

On each run: a top rail 0.13 ft round bar with its centre at Z = 15.95 between the end posts; a mid rail 0.06 ft square at Z = 15.50; vertical balusters 0.04 ft square from Z = 15.00 to 15.90 at 0.40 ft centres. The coping on the parapet is a 0.1 ft thick granite cap (M-GRANITE-STEP) the full parapet width.

## 7. Finishes and Materials

### 7.1 Finish schedule

| Area | Floor | Skirting | Walls | Ceiling |
| :--- | :--- | :--- | :--- | :--- |
| Master bedroom (F4), child bedroom (F13) | M-VIT-FLOOR 2 x 2 ft tiles | 0.33 ft vitrified | M-PAINT-INT | M-PAINT-CEIL |
| Lobby (F7), north gallery (F9), hallway (F12), stairs bay (F8), shaft alcove (F10), basin niche (F5) | M-VIT-FLOOR 2 x 2 ft tiles | 0.33 ft vitrified | M-PAINT-INT. In the niche, M-DADO-CERAMIC splash tiles from the counter top up 2.0 ft on the north wall | M-PAINT-CEIL |
| Kitchen (F3) | M-ANTISKID 2 x 2 ft tiles | 0.33 ft vitrified | M-PAINT-INT above the dado; M-DADO-CERAMIC 1 x 2 ft glazed tiles from the platform top (Z = 14.75) up 2.0 ft on the west and south walls | M-PAINT-CEIL |
| Bathroom 1 (F6), Bathroom 2 (F11) | M-ANTISKID 1 x 1 ft tiles, sloped 1:100 to the floor drain | none | M-DADO-CERAMIC 1 x 2 ft glazed tiles from the floor to Z = 19.0 (7.0 ft) on all four walls; paint above | M-PAINT-CEIL |
| Mandir (F14) | M-MARBLE-WHITE slabs 2 x 2 ft | 0.33 ft marble | M-PAINT-INT (white) | M-PAINT-CEIL |
| Balconies (F1, F2) | M-ANTISKID 1 x 1 ft tiles, sloped 1:100 to the drain BAL-04 | none | M-EXT-PLASTER on the parapet faces and on the kitchen and master bedroom walls that face the balcony | Roof slab underside, M-PAINT-CEIL |
| Staircase lane A | M-GRANITE-STEP treads and risers | 0.33 ft granite on the west wall | M-PAINT-INT | M-PAINT-CEIL |
| Exterior faces (south, west, north, east) | n/a | n/a | M-EXT-PLASTER on all outer faces, same as the ground floor | n/a |

Tile layout: tile grids start at the south-west corner of each room's clear floor area and run parallel to the X and Y axes. Joints 0.01 ft wide, slightly darker than the tile.

### 7.2 Material definitions (PBR)

Same materials as the ground floor, plus three new ones (M-MARBLE-WHITE, M-CARPET-RED, M-BRASS). Only materials used on this floor are listed.

| ID | Real material | Base colour | Roughness | Metallic |
| :--- | :--- | :--- | :--- | :--- |
| M-EXT-PLASTER | Cement plaster with texture paint, cream | #E6DCC6 | 0.90 | 0.0 |
| M-PAINT-INT | Interior emulsion, light cream | #F1E9D8 | 0.85 | 0.0 |
| M-PAINT-CEIL | Ceiling emulsion, white | #FBFAF6 | 0.90 | 0.0 |
| M-VIT-FLOOR | Vitrified tile, light beige-grey, polished | #D9D2C5 | 0.25 | 0.0 |
| M-ANTISKID | Matte anti-skid ceramic, warm grey | #BDB5A6 | 0.65 | 0.0 |
| M-DADO-CERAMIC | Glazed wall tile, off-white | #EEECE6 | 0.15 | 0.0 |
| M-GRANITE-STEP | Black granite, honed | #262626 | 0.35 | 0.0 |
| M-GRANITE-BLACK | Black granite platform, polished | #1B1B1B | 0.15 | 0.0 |
| M-DOOR-TEAK | Teak veneer flush door | #8B5A2B | 0.55 | 0.0 |
| M-DOOR-PVC | White PVC washroom door | #ECE9DF | 0.40 | 0.0 |
| M-FRAME-WOOD | Hardwood door frame, dark | #5A3A1E | 0.60 | 0.0 |
| M-ALU-FRAME | Anodised aluminium window frame, silver-grey | #9A9DA0 | 0.35 | 0.8 |
| M-GLASS | 5 mm clear glass | #CFE3E8 at 15 percent opacity | 0.05 | 0.0 |
| M-GRILL-MS | MS grill, black paint | #222222 | 0.45 | 0.6 |
| M-WOOD-DARK | Polished wood furniture, dark brown | #5C3B22 | 0.50 | 0.0 |
| M-LAMINATE-WALNUT | Walnut laminate | #6B4A32 | 0.40 | 0.0 |
| M-LAMINATE-GREY | Grey laminate kitchen cabinet | #8C8F92 | 0.40 | 0.0 |
| M-FABRIC-GREY | Sofa fabric, mid grey | #8A8C8E | 0.95 | 0.0 |
| M-FABRIC-BEIGE | Mattress and bed linen, beige | #D8CDB4 | 0.95 | 0.0 |
| M-FABRIC-WHITE | White pillow fabric | #F4F2EC | 0.95 | 0.0 |
| M-FABRIC-CURTAIN | Curtain, muted green | #7C8E73 | 0.95 | 0.0 |
| M-SANITARY-WHITE | Vitreous china, white | #F7F7F5 | 0.10 | 0.0 |
| M-MIRROR | Mirror | #D8E2E6 | 0.02 | 1.0 |
| M-CHROME | Chrome fittings | #C9CCCF | 0.15 | 1.0 |
| M-STEEL-SS | Stainless steel | #B8BCC0 | 0.30 | 0.9 |
| M-STEEL-GREY | Painted steel rack, grey | #7B8084 | 0.50 | 0.5 |
| M-GLASS-BLACK | Black glass (TV panel, hob) | #101214 | 0.08 | 0.0 |
| M-TERRACOTTA | Terracotta pot with green foliage on top | #B5683E | 0.80 | 0.0 |
| M-MARBLE-WHITE | White Makrana marble, polished | #F2EFE8 | 0.20 | 0.0 |
| M-CARPET-RED | Wool prayer mat, deep red | #8E2A2A | 0.95 | 0.0 |
| M-BRASS | Brass lamp | #B5902F | 0.30 | 1.0 |

## 8. Room-by-Room Interior

Every box below is solid, absolute coordinates, on the room's floor. Wall-mounted items give their height in the name.

### 8.1 Master bedroom (F4)

Layout: king bed with its head on the north wall, wardrobe along the south wall between the balcony door and the bedroom door, dressing table in the north-west corner, curtain on the west window. Clear distances: 3.0 ft between the wardrobe and the bed foot, 2.5 ft between the west wall and the bedside table. Door swings stay clear: DF1 (X 10.4 to 13.625, Y 11.75 to 14.8) and DF8 (X 0.5 to 3.25, Y 11.75 to 14.2).

| ID | Item | Box | Material |
| :--- | :--- | :--- | :--- |
| MB-01 | King bed frame 6.0 x 6.5 ft, head on north wall | `[4.000, 10.000, 16.750, 23.250, 12.000, 13.000]` | M-WOOD-DARK |
| MB-02 | Mattress 5.85 x 6.2 ft | `[4.075, 9.925, 16.900, 23.100, 13.000, 13.800]` | M-FABRIC-BEIGE |
| MB-03 | Headboard 6.0 ft wide, 3.5 ft above floor | `[4.000, 10.000, 23.000, 23.250, 12.000, 15.500]` | M-WOOD-DARK |
| MB-04 | Pillow pair, left | `[4.500, 6.500, 22.300, 23.000, 13.800, 14.150]` | M-FABRIC-WHITE |
| MB-05 | Pillow pair, right | `[7.500, 9.500, 22.300, 23.000, 13.800, 14.150]` | M-FABRIC-WHITE |
| MB-06 | Bedside table, west 1.5 x 1.5 ft | `[2.500, 4.000, 21.750, 23.250, 12.000, 13.750]` | M-WOOD-DARK |
| MB-07 | Bedside table, east 1.5 x 1.5 ft | `[10.000, 11.500, 21.750, 23.250, 12.000, 13.750]` | M-WOOD-DARK |
| MB-08 | Wardrobe 7.0 ft wide x 2.0 ft deep x 7.0 ft high | `[3.350, 10.350, 11.750, 13.750, 12.000, 19.000]` | M-LAMINATE-WALNUT |
| MB-09 | Dressing table 1.5 x 3.25 ft, 2.5 ft high | `[0.000, 1.500, 20.000, 23.250, 12.000, 14.500]` | M-LAMINATE-WALNUT |
| MB-10 | Dressing mirror on the west wall, 2.45 x 3.5 ft | `[0.000, 0.100, 20.400, 22.850, 14.500, 18.000]` | M-MIRROR |
| MB-11 | Dressing stool | `[1.600, 2.400, 20.800, 21.600, 12.000, 13.500]` | M-WOOD-DARK |
| MB-12 | Curtain, west window (hung 0.15 ft off the wall) | `[0.050, 0.200, 15.000, 20.000, 12.100, 19.300]` | M-FABRIC-CURTAIN |

### 8.2 Basin niche (F5)

A single wash-basin unit on the north wall. The niche is open to the lobby on its south side, so keep the floor clear.

| ID | Item | Box | Material |
| :--- | :--- | :--- | :--- |
| NB-01 | Wash basin bowl 1.75 x 1.3 ft | `[14.750, 16.500, 21.950, 23.250, 14.000, 14.750]` | M-SANITARY-WHITE |
| NB-02 | Basin pedestal | `[15.250, 16.000, 22.500, 23.000, 12.000, 14.000]` | M-SANITARY-WHITE |
| NB-03 | Mirror 1.55 x 2.0 ft above basin | `[14.850, 16.400, 23.150, 23.250, 16.000, 18.000]` | M-MIRROR |

### 8.3 Bathroom 1 (F6)

Layout along the north wall from west to east: basin, WC, shower. The door swing (X 17.625 to 20.125, Y 19.25 to 21.75) stays clear. The shower has no curtain or glass; the wet area is the east 2.6 ft.

| ID | Item | Box | Material |
| :--- | :--- | :--- | :--- |
| B1-01 | Western WC, floor mounted, 1.25 x 2.25 ft | `[21.000, 22.250, 21.000, 23.250, 12.000, 13.400]` | M-SANITARY-WHITE |
| B1-02 | Wash basin bowl 1.75 x 1.3 ft | `[18.000, 19.750, 21.950, 23.250, 14.000, 14.750]` | M-SANITARY-WHITE |
| B1-03 | Basin pedestal | `[18.500, 19.250, 22.500, 23.000, 12.000, 14.000]` | M-SANITARY-WHITE |
| B1-04 | Mirror 1.55 x 2.0 ft above basin | `[18.100, 19.650, 23.150, 23.250, 16.000, 18.000]` | M-MIRROR |
| B1-05 | Electric geyser 15 L above WC | `[21.100, 22.000, 22.350, 23.250, 17.500, 18.900]` | M-SANITARY-WHITE |
| B1-06 | Shower head 0.5 ft dia, on north wall x=25.3 | `[25.050, 25.550, 22.300, 22.800, 18.350, 18.400]` | M-CHROME |
| B1-07 | Shower arm | `[25.200, 25.400, 22.800, 23.250, 18.400, 18.500]` | M-CHROME |
| B1-08 | Shower mixer valve | `[25.100, 25.500, 23.100, 23.250, 15.300, 15.600]` | M-CHROME |
| B1-09 | Floor drain grate 0.4 x 0.4 ft | `[25.100, 25.500, 21.000, 21.400, 12.000, 12.020]` | M-STEEL-SS |

### 8.4 Bathroom 2 (F11)

Layout along the north wall from west to east: shower, WC, basin. The door swing (X 37.125 to 39.875, Y 19.25 to 21.75) stays clear.

| ID | Item | Box | Material |
| :--- | :--- | :--- | :--- |
| B2-01 | Western WC, floor mounted, 1.25 x 2.25 ft | `[35.400, 36.650, 21.000, 23.250, 12.000, 13.400]` | M-SANITARY-WHITE |
| B2-02 | Wash basin bowl 1.75 x 1.3 ft | `[38.000, 39.750, 21.950, 23.250, 14.000, 14.750]` | M-SANITARY-WHITE |
| B2-03 | Basin pedestal | `[38.500, 39.250, 22.500, 23.000, 12.000, 14.000]` | M-SANITARY-WHITE |
| B2-04 | Mirror 1.5 x 2.0 ft above basin | `[38.100, 39.600, 23.150, 23.250, 16.000, 18.000]` | M-MIRROR |
| B2-05 | Electric geyser 15 L on east wall | `[38.975, 39.875, 22.200, 23.100, 17.500, 18.900]` | M-SANITARY-WHITE |
| B2-06 | Shower head 0.5 ft dia, on north wall x=33.9 | `[33.650, 34.150, 22.300, 22.800, 18.350, 18.400]` | M-CHROME |
| B2-07 | Shower arm | `[33.800, 34.000, 22.800, 23.250, 18.400, 18.500]` | M-CHROME |
| B2-08 | Shower mixer valve | `[33.700, 34.100, 23.100, 23.250, 15.300, 15.600]` | M-CHROME |
| B2-09 | Floor drain grate 0.4 x 0.4 ft | `[33.700, 34.100, 21.000, 21.400, 12.000, 12.020]` | M-STEEL-SS |

### 8.5 Kitchen (F3)

L-shaped platform, 2.75 ft above the floor: west leg 2.0 x 7.0 ft, south leg 7.375 x 2.25 ft (these are the drawn "KT" lines). Sink under window WF-2, hob under exhaust fan EF-F. Door swings (DF2 X 10.5 to 13.625, Y 8.375 to 11.375; DF3 X 11.0 to 13.625, Y 4.375 to 6.7) stay clear.

| ID | Item | Box | Material |
| :--- | :--- | :--- | :--- |
| KF-01 | Base cabinet, west leg, 2.0 x 7.0 ft | `[3.625, 5.625, 4.375, 11.375, 12.000, 14.600]` | M-LAMINATE-GREY |
| KF-02 | Granite platform top, west leg (0.075 ft overhang) | `[3.625, 5.700, 4.375, 11.375, 14.600, 14.750]` | M-GRANITE-BLACK |
| KF-03 | Base cabinet, south leg, 7.375 x 2.25 ft | `[3.625, 11.000, 4.375, 6.625, 12.000, 14.600]` | M-LAMINATE-GREY |
| KF-04 | Granite platform top, south leg | `[3.625, 11.000, 4.375, 6.700, 14.600, 14.750]` | M-GRANITE-BLACK |
| KF-05 | Double-bowl steel sink 2.5 x 1.6 ft (recessed 0.7 ft) | `[3.850, 5.450, 7.000, 9.500, 14.050, 14.750]` | M-STEEL-SS |
| KF-06 | Sink tap | `[3.650, 4.000, 8.100, 8.400, 14.750, 15.450]` | M-CHROME |
| KF-07 | 4-burner gas hob 2.0 x 1.6 ft | `[7.500, 9.500, 4.600, 6.200, 14.750, 14.850]` | M-GLASS-BLACK |
| KF-08 | Wall cabinet, south wall west of fan | `[3.625, 6.900, 4.375, 5.375, 18.250, 20.500]` | M-LAMINATE-GREY |
| KF-09 | Wall cabinet, south wall east of fan | `[9.750, 11.000, 4.375, 5.375, 18.250, 20.500]` | M-LAMINATE-GREY |
| KF-10 | Wall cabinet, west wall north of window | `[3.625, 4.625, 10.000, 11.375, 18.250, 20.500]` | M-LAMINATE-GREY |
| KF-11 | Refrigerator, single door 1.8 x 2.0 x 5.5 ft | `[5.900, 7.700, 9.375, 11.375, 12.000, 17.500]` | M-STEEL-SS |

### 8.6 Lobby: living and dining (F7)

Living nook against the east wall (sofa faces the TV), dining set in the north-centre. A 2.0 ft corridor runs along the west wall (X 14.0 to 16.0) between the master bedroom and kitchen doors; a 2.0 ft corridor runs along the east wall (X 24.0 to 26.0) from the gallery to the TV zone.

| ID | Item | Box | Material |
| :--- | :--- | :--- | :--- |
| LB-01 | Three-seat sofa seat base, faces east 2.75 x 6.5 ft | `[16.800, 19.550, 3.500, 10.000, 12.000, 12.600]` | M-FABRIC-GREY |
| LB-02 | Sofa seat cushions (seat 1.5 ft above floor) | `[17.550, 19.550, 4.000, 9.500, 12.600, 13.500]` | M-FABRIC-GREY |
| LB-03 | Sofa back (2.8 ft above floor) | `[16.800, 17.550, 3.500, 10.000, 12.600, 14.800]` | M-FABRIC-GREY |
| LB-04 | Sofa arm, south | `[17.550, 19.550, 3.500, 4.000, 12.600, 14.100]` | M-FABRIC-GREY |
| LB-05 | Sofa arm, north | `[17.550, 19.550, 9.500, 10.000, 12.600, 14.100]` | M-FABRIC-GREY |
| LB-06 | Centre table 2.0 x 2.5 x 1.4 ft | `[20.800, 22.800, 5.500, 8.000, 12.000, 13.400]` | M-WOOD-DARK |
| LB-07 | TV unit 1.25 x 4.0 x 1.3 ft against east wall | `[24.750, 26.000, 4.000, 8.000, 12.000, 13.300]` | M-LAMINATE-WALNUT |
| LB-08 | 55-inch TV, wall mounted (4.0 x 2.3 ft panel, centre 3.5 ft above floor) | `[25.850, 26.000, 4.000, 8.000, 14.350, 16.650]` | M-GLASS-BLACK |
| LB-09 | Dining table top 5.0 x 3.0 ft, 2.5 ft high | `[17.500, 22.500, 12.000, 15.000, 14.300, 14.500]` | M-WOOD-DARK |
| LB-10 | Dining table leg | `[17.500, 17.700, 12.000, 12.200, 12.000, 14.300]` | M-WOOD-DARK |
| LB-11 | Dining table leg | `[22.300, 22.500, 12.000, 12.200, 12.000, 14.300]` | M-WOOD-DARK |
| LB-12 | Dining table leg | `[17.500, 17.700, 14.800, 15.000, 12.000, 14.300]` | M-WOOD-DARK |
| LB-13 | Dining table leg | `[22.300, 22.500, 14.800, 15.000, 12.000, 14.300]` | M-WOOD-DARK |
| LB-14 | Dining chair, west end | `[16.000, 17.700, 12.750, 14.250, 12.000, 13.600]` | M-WOOD-DARK |
| LB-15 | Dining chair, east end | `[22.300, 24.000, 12.750, 14.250, 12.000, 13.600]` | M-WOOD-DARK |
| LB-16 | Dining chair, south side left | `[18.000, 19.500, 10.750, 12.250, 12.000, 13.600]` | M-WOOD-DARK |
| LB-17 | Dining chair, south side right | `[20.500, 22.000, 10.750, 12.250, 12.000, 13.600]` | M-WOOD-DARK |
| LB-18 | Dining chair, north side left | `[18.000, 19.500, 14.750, 16.000, 12.000, 13.600]` | M-WOOD-DARK |
| LB-19 | Dining chair, north side right | `[20.500, 22.000, 14.750, 16.000, 12.000, 13.600]` | M-WOOD-DARK |
| LB-20 | Curtain, south window left (hung 0.15 ft off the wall) | `[14.500, 19.500, 0.050, 0.200, 12.100, 19.300]` | M-FABRIC-CURTAIN |
| LB-21 | Curtain, south window right | `[20.500, 25.500, 0.050, 0.200, 12.100, 19.300]` | M-FABRIC-CURTAIN |

### 8.7 Hallway (F12)

Vanity with basin against the stair wall; washing machine at the south end against the south wall. The corridor X 36.3 to 37.9 stays clear for the full length.

| ID | Item | Box | Material |
| :--- | :--- | :--- | :--- |
| HW-01 | Vanity base cabinet 2.0 x 3.75 ft | `[34.250, 36.250, 3.000, 6.750, 12.000, 14.600]` | M-LAMINATE-GREY |
| HW-02 | Granite vanity top (0.075 ft overhang) | `[34.250, 36.325, 3.000, 6.750, 14.600, 14.750]` | M-GRANITE-BLACK |
| HW-03 | Wash basin bowl 1.4 x 1.6 ft (recessed) | `[34.500, 35.900, 4.050, 5.650, 14.000, 14.750]` | M-SANITARY-WHITE |
| HW-04 | Basin tap | `[34.300, 34.600, 4.700, 5.000, 14.750, 15.400]` | M-CHROME |
| HW-05 | Mirror 2.1 x 2.5 ft on the west wall | `[34.250, 34.350, 3.800, 5.900, 16.000, 18.500]` | M-MIRROR |
| HW-06 | Washing machine, front loader 2.0 x 2.0 x 3.0 ft | `[37.875, 39.875, 0.000, 2.000, 12.000, 15.000]` | M-SANITARY-WHITE |

### 8.8 Child bedroom (F13)

Bed head on the east wall, wardrobe on the south wall away from the door, desk on the west wall, bookshelf on the east wall by the north corner. Door swing (X 40.25 to 43.75, Y 9.375 to 12.875) stays clear.

| ID | Item | Box | Material |
| :--- | :--- | :--- | :--- |
| CH-01 | Single bed frame 4.0 x 6.5 ft, head on east wall | `[42.750, 49.250, 13.500, 17.500, 12.000, 12.900]` | M-WOOD-DARK |
| CH-02 | Mattress 3.9 x 6.4 ft | `[42.850, 49.150, 13.600, 17.400, 12.900, 13.600]` | M-FABRIC-BEIGE |
| CH-03 | Headboard 4.0 ft wide, 2.8 ft above floor | `[49.000, 49.250, 13.500, 17.500, 12.000, 14.800]` | M-WOOD-DARK |
| CH-04 | Pillow | `[48.000, 48.900, 14.200, 15.800, 13.600, 13.950]` | M-FABRIC-WHITE |
| CH-05 | Bedside table, south 1.5 x 1.5 ft | `[47.750, 49.250, 12.000, 13.500, 12.000, 13.600]` | M-WOOD-DARK |
| CH-06 | Bedside table, north 1.5 x 1.5 ft | `[47.750, 49.250, 17.500, 19.000, 12.000, 13.600]` | M-WOOD-DARK |
| CH-07 | Wardrobe 4.0 ft wide x 2.0 ft deep x 7.0 ft high | `[44.500, 48.500, 9.375, 11.375, 12.000, 19.000]` | M-LAMINATE-WALNUT |
| CH-08 | Study desk top 2.0 x 4.0 ft, 2.5 ft high | `[40.250, 42.250, 19.000, 23.000, 14.300, 14.500]` | M-WOOD-DARK |
| CH-09 | Desk side panel, south | `[40.250, 42.250, 19.000, 19.100, 12.000, 14.300]` | M-WOOD-DARK |
| CH-10 | Desk side panel, north | `[40.250, 42.250, 22.900, 23.000, 12.000, 14.300]` | M-WOOD-DARK |
| CH-11 | Study chair seat | `[42.250, 43.750, 20.000, 21.500, 12.000, 13.600]` | M-WOOD-DARK |
| CH-12 | Study chair back | `[43.550, 43.750, 20.000, 21.500, 13.600, 15.200]` | M-WOOD-DARK |
| CH-13 | Bookshelf 1.0 x 3.0 ft, 6.0 ft high | `[48.250, 49.250, 20.000, 23.000, 12.000, 18.000]` | M-WOOD-DARK |
| CH-14 | Curtain, north window (hung 0.15 ft off the wall) | `[43.000, 48.000, 23.050, 23.200, 12.100, 19.300]` | M-FABRIC-CURTAIN |

### 8.9 Mandir (F14)

Marble platform with the wooden temple unit against the east wall, two brass lamps on the platform, a prayer mat in front. Door swing (X 40.25 to 42.5, Y 6.5 to 9.0) stays clear.

| ID | Item | Box | Material |
| :--- | :--- | :--- | :--- |
| MD-01 | Marble platform 5.2 x 2.0 ft, 1.8 ft high, against east wall | `[42.150, 47.350, 0.000, 2.000, 12.000, 13.800]` | M-MARBLE-WHITE |
| MD-02 | Wooden temple shrine unit with mandir.jpg photo on the platform | `[42.350, 47.150, 0.000, 1.200, 13.800, 18.200]` | M-WOOD-DARK |
| MD-03 | Brass diya lamp, south | `[42.350, 42.750, 1.450, 1.850, 13.800, 14.800]` | M-BRASS |
| MD-04 | Brass diya lamp, north | `[46.750, 47.150, 1.450, 1.850, 13.800, 14.800]` | M-BRASS |
| MD-05 | Prayer mat 2.0 x 2.0 ft | `[43.750, 45.750, 2.800, 4.800, 12.000, 12.040]` | M-CARPET-RED |

### 8.10 Balconies (F1, F2)

Drying stand in the south balcony, two pots in the west balcony, a drain in the south-west corner. The west balcony is entered from the master bedroom (DF8) and from the south balcony, which is entered from the kitchen (DF3). The railing and parapet are in sections 3 and 6.

| ID | Item | Box | Material |
| :--- | :--- | :--- | :--- |
| BAL-01 | Folding clothes-drying stand 4.0 x 1.5 x 4.5 ft | `[5.000, 9.000, 1.000, 2.500, 12.000, 16.500]` | M-STEEL-GREY |
| BAL-02 | Potted plant 1 (pot + foliage) | `[0.400, 1.200, 5.000, 5.800, 12.000, 14.500]` | M-TERRACOTTA |
| BAL-03 | Potted plant 2 | `[0.400, 1.200, 8.000, 8.800, 12.000, 14.500]` | M-TERRACOTTA |
| BAL-04 | Floor drain grate 0.4 x 0.4 ft | `[0.300, 0.700, 0.300, 0.700, 12.000, 12.020]` | M-STEEL-SS |

## 9. Electrical and Lighting

### 9.1 Ceiling fans (3 blades, 1200 mm sweep)

Each fan assembly hangs from the roof-slab underside (Z = 22.0): canopy cylinder radius 0.25 ft, Z 21.75 to 22.00; down-rod radius 0.04 ft, Z 21.25 to 21.75; hub cylinder radius 0.30 ft, Z 21.10 to 21.25; three blades 0.40 ft wide, 0.03 ft thick, from radius 0.30 to 1.97 ft at Z = 21.12, 120 degrees apart. Blade tips are above 10 ft, well over head height.

| ID | Room | Centre (X, Y) |
| :--- | :--- | :--- |
| FN-F1 | Master bedroom | (6.800, 17.500) |
| FN-F2 | Lobby, over the living area | (21.000, 6.500) |
| FN-F3 | Lobby, over the dining table | (20.000, 13.500) |
| FN-F4 | Child bedroom | (45.000, 16.500) |
| FN-F5 | Mandir | (44.750, 4.500) |

### 9.2 Ceiling lights

LED panels are flat boxes 0.06 ft thick at Z 21.94 to 22.00, white, emissive (warm white, 4000 K). The mandir light is 3000 K. The balcony uses a 1.0 x 0.5 ft LED bulkhead.

| ID | Room | Centre (X, Y) | Size (X x Y, ft) |
| :--- | :--- | :--- | :--- |
| LT-F1 | Master bedroom | (6.800, 20.500) | 2 x 2 |
| LT-F2 | Kitchen | (8.625, 8.000) | 2 x 2 |
| LT-F3 | Lobby, south-west | (17.500, 6.000) | 2 x 2 |
| LT-F4 | Lobby, south-east | (22.500, 6.000) | 2 x 2 |
| LT-F5 | Lobby, dining west | (17.500, 14.000) | 2 x 2 |
| LT-F6 | Lobby, dining east | (22.500, 14.000) | 2 x 2 |
| LT-F7 | Lobby, north | (20.000, 17.500) | 2 x 2 |
| LT-F8 | North gallery west | (29.000, 16.900) | 2 x 2 |
| LT-F9 | North gallery east | (32.500, 16.900) | 2 x 2 |
| LT-F10 | Hallway south | (37.000, 4.000) | 2 x 2 |
| LT-F11 | Hallway centre | (37.000, 10.000) | 2 x 2 |
| LT-F12 | Hallway north | (37.000, 16.000) | 2 x 2 |
| LT-F13 | Child bedroom | (45.000, 19.500) | 2 x 2 |
| LT-F14 | Mandir | (44.750, 6.500) | 2 x 2 |
| LT-F15 | Basin niche | (15.600, 21.000) | 1 x 1 |
| LT-F16 | Bathroom 1 | (22.125, 21.250) | 1 x 1 |
| LT-F17 | Bathroom 2 | (36.375, 21.250) | 1 x 1 |
| LT-F18 | South balcony (bulkhead) | (6.800, 2.000) | 1 x 0.5 |

### 9.3 Switchboards and sub-distribution board

Modular switch plates 0.4 x 0.4 ft, 0.1 ft proud of the wall, white, at Z 15.8 to 16.2 (3.8 to 4.2 ft above the floor). One per room, next to the door on the latch side.

| ID | Room | Box |
| :--- | :--- | :--- |
| SB-MB | Master bedroom | `[13.525, 13.625, 15.200, 15.600, 15.800, 16.200]` |
| SB-KIT | Kitchen | `[13.525, 13.625, 7.600, 8.000, 15.800, 16.200]` |
| SB-LOB | Lobby | `[14.000, 14.100, 15.300, 15.700, 15.800, 16.200]` |
| SB-B1 | Bathroom 1 | `[20.400, 20.800, 19.250, 19.350, 15.800, 16.200]` |
| SB-B2 | Bathroom 2 | `[36.500, 36.900, 19.250, 19.350, 15.800, 16.200]` |
| SB-CH | Child bedroom | `[40.250, 40.350, 13.100, 13.500, 15.800, 16.200]` |
| SB-MD | Mandir | `[40.250, 40.350, 5.600, 6.000, 15.800, 16.200]` |
| SB-HALL | Hallway | `[34.250, 34.350, 8.000, 8.400, 15.800, 16.200]` |
| SUB-DB | First-floor sub-distribution board (lobby north wall), 0.8 x 1.0 ft, metal box | `[24.000, 24.800, 18.775, 18.875, 16.000, 17.000]` |

No visible wiring, conduits, sockets or cables are modelled. They are inside the walls.

## 10. Exterior and Balcony

* All outer wall faces: M-EXT-PLASTER, plain, no band, no cornice, no name plate, no chajja. The first-floor faces continue the ground-floor faces upward with no step.
* Balcony: the south and west outer walls are 3.0 ft parapets (OF2) with an MS railing on top (6.3); the balcony is open above the railing up to the roof slab, which acts as its roof.
* The balcony is entered through the glazed kitchen door DF3 (OF1) into the south balcony, and through the glazed master bedroom door DF8 (OF6) into the west balcony. The two balconies are one continuous floor.
* Roof and terrace: **not modelled beyond the roof slab.** No parapet, stair-head cover, water tank, solar panel or antenna.
* Street and neighbours: not modelled.

## 11. What NOT to Add

Do not add: columns, beams, chajjas, air conditioners, curtains other than MB-12, LB-20, LB-21 and CH-14, rugs, carpets (except MD-05), wall art, photo frames, plants other than BAL-02 and BAL-03, a bathtub, a second washing machine, a television in any room other than the lobby, a gate, a stair-head cover, a terrace parapet, a water tank, CCTV, signage, people, animals, or any item not listed in this file or the base files.

## 12. Build Order for This File

Apply after the ground-floor files and the first-floor base file's section 13 recipe are complete:

1. Section 3 overrides OF1 to OF4 and OF6 (change, split or add the listed boxes).
2. Section 4 voids (subtract from walls). Re-split wall pieces as needed so the geometry stays clean.
3. Window frames, panes, grills and sills (section 4 construction rules).
4. Door frames, leaves and hardware (section 5).
5. Stair finish, balusters and handrail (6.1), guard rail (6.2), balcony railing and coping (6.3).
6. Assign finishes and materials by area (section 7).
7. Rooms in the order of section 8, item by item.
8. Fans, lights, switchboards and the sub-distribution board (section 9).
9. Exterior and balcony (section 10).
10. Verification (section 13).

## 13. Verification

**Counts**

| Group | Count |
| :--- | :--- |
| Room items (section 8) | 94 |
| Wall voids (section 4) | 11 |
| Doors (frame 3 boxes + leaf) | 8 |
| Duct boxes (4 walls + cap) | 5 |
| Wall splits and additions (OF1, OF2, OF6) | 8 (F-INT-04 shortened, F-LIN-07, F-EXT-W and F-EXT-S each split in two, F-INT-02 split in two, F-LIN-08) |
| Ceiling fans | 5 |
| Ceiling lights | 18 |
| Switchboards and sub-DB | 9 |
| Stair balusters (lane A) | 24, plus 1 handrail |
| Guard rail runs | 2 (GR-S, GR-W) |
| Balcony railing runs | 2 |

**Programmatic checks that passed on this data**

1. Every room item lies inside its room's clear floor area (section 4 of the base file) and between the floor (Z = 12.00) and the roof slab (Z = 22.00).
2. No two items from different furniture sets overlap in the same room. (Chairs and the dining table, sink and platform, bed parts and sofa parts intentionally belong to one set each.)
3. No item lies inside a wall footprint or inside the duct. No item blocks a window opening.
4. No item enters a door swing zone: DF1 `X 10.4-13.625, Y 11.75-14.8`; DF2 `X 10.5-13.625, Y 8.375-11.375`; DF3 `X 11.0-13.625, Y 4.375-6.7`; DF4 `X 17.625-20.125, Y 19.25-21.75`; DF5 `X 37.125-39.875, Y 19.25-21.75`; DF6 `X 40.25-43.75, Y 9.375-12.875`; DF7 `X 40.25-42.5, Y 6.5-9.0`; DF8 `X 0.5-3.25, Y 11.75-14.2`.
5. A 1.2 ft wide walker can follow every route in the table below without touching a wall, the duct, or an item at body height.

| # | Route | Waypoints (X, Y) |
| :--- | :--- | :--- |
| 1 | Stair arrival to the lobby east corridor and living area | (32.0, 14.6) -> (32.0, 16.9) -> (25.0, 16.9) -> (25.0, 9.5) -> (22.0, 9.0) |
| 2 | Lobby to kitchen | (15.0, 16.9) -> (15.0, 9.9) -> (13.8, 9.9) -> (11.0, 9.9) -> (9.5, 8.5) |
| 3 | Lobby to master bedroom | (15.0, 13.4) -> (13.8, 13.4) -> (12.2, 13.8) -> (11.8, 15.2) -> (9.0, 15.2) |
| 4 | Kitchen to the balcony and the west balcony | (11.0, 9.9) -> (12.3, 7.5) -> (12.3, 5.0) -> (12.3, 3.4) -> (10.5, 3.4) -> (2.2, 3.4) -> (2.2, 8.0) |
| 5 | Lobby to Bathroom 1 | (18.9, 17.0) -> (18.9, 19.9) -> (23.5, 19.9) |
| 6 | Lobby to basin niche | (15.6, 17.0) -> (15.6, 20.5) |
| 7 | Gallery to shaft alcove | (30.0, 17.0) -> (30.0, 18.4) |
| 8 | Hallway to Bathroom 2 | (38.5, 17.0) -> (38.5, 19.9) -> (34.2, 19.9) |
| 9 | Hallway to child bedroom | (37.5, 11.1) -> (41.5, 11.1) -> (41.5, 16.0) |
| 10 | Hallway to mandir | (37.5, 7.75) -> (41.0, 7.75) -> (43.0, 7.5) -> (44.5, 6.0) |
| 11 | Hallway, north to south end | (37.2, 16.9) -> (37.2, 3.5) |
| 12 | Gallery to hallway | (25.0, 16.9) -> (30.0, 16.9) -> (37.2, 16.9) |
| 13 | Master bedroom to the west balcony | (6.0, 15.2) -> (2.0, 15.0) -> (1.9, 12.5) -> (1.9, 10.5) -> (2.2, 8.0) |

**Visual checks**

* From the master bedroom's lobby door the wardrobe is on the left, the king bed straight ahead with its head on the far wall, and the west window with its curtain on the right; at the far left, beyond the wardrobe, is the glazed balcony door.
* The kitchen has a black granite L-platform; the sink is under the west window WF-2, the hob under the exhaust fan EF-F, and the glazed balcony door is at the south-east corner.
* The balcony is reachable from the kitchen (glazed door at the south-east corner of the kitchen) and from the master bedroom (glazed door at the north end of the west balcony); its south and west edges are a 3 ft parapet with a 1 ft railing on top.
* The lobby sofa faces east toward the TV on the east wall; the dining table is in the north-centre of the lobby with six chairs.
* Every bathroom has a WC, a basin with mirror above, a geyser, a ventilator with exhaust fan, a shower and a floor drain, and nothing else.
* The mandir has a marble floor and a marble platform with the wooden temple against the east wall.
* From the street (south and west) the house shows the lobby windows, the stairs-bay, hallway and mandir windows with black grills, the master bedroom window, and the balcony parapet with railing.

## 14. Assumption Register for This File

All [IN]. If the owner contradicts any row, change only the listed boxes.

| Item | Value | Where it appears |
| :--- | :--- | :--- |
| Kitchen balcony door | 2.625 ft, kitchen south-east corner | OF1, DF3 |
| Master bedroom balcony door | 2.75 ft, hinged west, opens into the bedroom | OF6, DF8 |
| Parapet | 3.0 ft brick + 1.0 ft MS railing | OF2, 6.3 |
| Window size and sill | 4 x 4 ft or 3 x 3 ft, sill 3.0 or 3.5 ft above floor | Section 4 |
| Ventilator size and level | 2 x 1.5 ft, sill 5.5 ft above floor | Section 4 |
| Door types | Teak flush, PVC bathroom, glazed aluminium balcony | Section 5 |
| Guard rail | 3.0 ft high, stainless steel | 6.2 |
| Duct | 4 x 3 ft clear, centre (30, 21) | OF3 |
| Kitchen platform | 2.0 and 2.25 ft deep, 2.75 ft high, granite (the plan's lines) | 8.5 |
| Sofa | Seat 1.5 ft, back 2.8 ft above floor | 8.6 |
| Fan sweep | 1200 mm | 9.1 |
| Light type | LED, warm white | 9.2 |
| Colours | Cream paint, beige-grey tiles, black granite, white marble in the mandir | Section 7 |

## 15. Still Not Resolved

These cannot be answered from a first-floor plan, and this file does not guess them:

1. **Whether the heavy black bar is a door.** It is read as the kitchen balcony door here (OF1). If the owner says it is a wall, turn OF1 off and remove DF3; the balcony is then reached only from the master bedroom (DF8), and the kitchen exhaust fan EF-F would vent into a closed wall, so it must be removed too. Route 4 then changes to start in the master bedroom.
2. **The stair-head cover and the terrace.** A stair that reaches an open terrace normally ends in a small roofed room (mumty) and the terrace has a parapet and water tank. The base file does not draw them and this file does not add them.
3. **The real staircase.** The ground flight is steep (see the ground-floor file, section 15); the first-floor flight is the comfortable one (0.75 ft risers). Their real count, direction and turn are assumptions.
4. **Window positions.** They are the standard choice, not read from the plan, so they must be checked against the owner's wishes.
5. **Furniture.** Typical but not specific; it is a layout, not a record of what is there.
