# Ground Floor: Fit-Out, Openings and Interior Specification (supplement)

## 0. Purpose, precedence and builder instruction

This file supplements `ground_floor_3d_simulation_specification.md` (the **base file**). The base file fixes the structure: walls, floors, steps, stair, slab. This file adds everything a real Indian house has on top of that structure and that the 2D plan does not show: windows, doors, gates, finishes, fixtures, furniture, lighting, garden and vehicles. It also answers every open question in the base file (section 12 of the base file) with the most common choice for a typical Indian house.

> **System Instruction for 3D Builder LLM:** First build the base file completely (its section 13 recipe). Then apply this file in the order of section 12. This file **replaces** the base file's rule "do not add windows, doors, furniture or fixtures": you MUST add every item listed here with the exact coordinates given, and you MUST NOT add anything that is not listed. Do not move, resize, rename or omit items. Where this file overrides a base-file box (section 3), the override wins. Everything is in feet, Z-up, with the same axes as the base file.

**Precedence:** (1) section 3 overrides, (2) this file, (3) the base file, in that order.

**Tags.** **[IN]** = typical Indian residential practice (an assumption, not read from the plan; North India, e.g. Uttar Pradesh, hot climate, RCC-framed brick construction). **[P] [D] [M] [A]** keep the meaning they have in the base file. Every [IN] value can be replaced in one place if the owner says otherwise.

## 1. Conventions

* Boxes are `[xmin, xmax, ymin, ymax, zmin, zmax]` in **absolute** feet (not heights above the floor). House floor is Z = 1.50, garage floor is the wedge Z = Y/30, garden and gate landing are Z = 0.00.
* "Void" boxes are subtracted from walls. "Solid" boxes are added.
* All furniture sits directly on the floor. Nothing floats unless it is wall-mounted (those items state their height).
* Item names give the real-world size (for example 5.0 x 6.5 ft) so the builder can sanity-check the box.

## 2. Decision Register: answers to the open questions

Each row answers an open question from base-file section 12 or section 14.

| # | Question | Answer used | Basis |
| :--- | :--- | :--- | :--- |
| 1 | Plinth height | 1.50 ft (18") above street, three 6" steps at the entrance | [IN] standard plinth for a house in a flood-prone, hot climate |
| 2 | Ceiling and slab | 10 ft clear (Z = 11.5), RCC slab 6" thick (Z 11.5 to 12.0) | [IN] normal range is 5" to 6" slab and 10 ft clear |
| 3 | Wall thickness | 9" brick exterior, 4.5" brick interior partitions | [IN] standard; the interior value also fits the plan's dimension chains |
| 4 | Columns and beams | RCC frame is assumed but **not modelled**. Columns and beams are buried in the walls and slab. Do not add any. | [IN] Visible columns would break the clear room sizes written on the plan |
| 5 | Windows | Aluminium sliding windows with 5 mm glass and an MS safety grill, 4 x 4 ft, sill 3 ft above floor, head at 7 ft. Ventilators 2 x 1.5 ft at the head of wet rooms | [IN] standard ground-floor practice |
| 6 | Where windows can go | Only on the street side (south), the garden side (the west wall of the house) and the rear (north) wall. **None on the east wall** or any wall shared with a neighbour. | [IN] The house is built to the plot boundary on the north and east, so only the south and garden sides have light |
| 7 | Door heads and sizes | 7 ft clear height; flush doors 3 ft (bedroom, kitchen), 2.5 ft (washrooms), 3.5 ft (storeroom). Wide passages (3.875 ft) are plain square openings, no arch, no door | [IN] |
| 8 | Main entrance door | None. The porch and south hallway form an open covered verandah. Only the two MS gates close the plot. | The plan has no wall between porch and hallway |
| 9 | Shaft (Z10) | An open-to-sky service/ventilation duct, clear size 4.0 x 3.0 ft, centred on (30.0, 21.0), 4.5" brick walls, MS jali cap at the slab top | [IN] a small boxed duct in a plan is conventionally a shaft |
| 10 | Garage-to-house step | Replace the single 1.0 ft step with **two 6" steps** (one extra step block in the garage) | [IN] a 12" riser is not normal |
| 11 | West washroom door width | 2.5 ft (the measured 2.375 ft is within the plan's tolerance) | [IN] 2'6" is the standard bathroom door |
| 12 | Garden boundary wall height | 6.0 ft on the west side | [IN] typical compound wall |
| 13 | Washroom fittings | Western WC, wall-hung basin on pedestal, mirror, electric geyser, exhaust fan, floor drain, no bathtub | [IN] common in new construction |
| 14 | Kitchen | L-shaped granite platform (south and west walls), double-bowl steel sink under a window, 4-burner hob, exhaust fan, fridge, overhead cabinets | [IN] standard Indian kitchen |
| 15 | Lobby use | Combined living and dining: two-seat sofa, centre table, TV unit, 4-seat dining table | [IN] |
| 16 | Garage gate and front | Two-leaf MS swing gate 7.8 ft high with a solid brick band above it up to the slab | [IN] |
| 17 | Climate equipment | Ceiling fans, LED panel lights, exhaust fans. No air conditioning, no heaters, no chimney | [IN] hot climate, ground floor, budget-standard fit-out |
| 18 | Stair | **Not changed.** The ground-floor flight stays as in the base file. Its real upper flights are not on the plan and are out of scope. See section 15. | Cannot be resolved from a ground-floor plan |
| 19 | Plan north | Top of the sheet | [A] |
| 20 | South wall end (X = 36.5) | Kept | Cannot be resolved without the physical plan |

## 3. Geometry Overrides to the Base File

Apply these before anything else. Boxes not listed here stay exactly as in the base file.

| ID | Change | Boxes |
| :--- | :--- | :--- |
| O1 | West boundary wall (garden side) is 6.0 ft high, not 11.5 ft | W-EXT-W becomes `[-0.750, 0.000, 7.500, 23.250, 0.000, 6.000]` |
| O2 | West washroom door is 2.5 ft wide | W-INT-04a becomes `[13.625, 14.000, 21.750, 23.250, 0.000, 11.500]`. Lintel W-INT-04L becomes `[13.625, 14.000, 19.250, 21.750, 8.500, 11.500]` |
| O3 | Garage front: solid band above the gate and the missing corner | GB `[36.500, 50.000, -0.750, 0.000, 8.000, 11.500]` and SE-FILL `[49.250, 50.000, -0.750, 0.000, 0.000, 8.000]` |
| O4 | Garage threshold becomes two 6" steps | ST-G `[34.250, 41.250, 14.000, 15.000, 0.000, 1.000]` (top at Z = 1.00; the 1.00 ft rise at Y = 15 becomes two rises of about 0.53 and 0.50 ft) |
| O5 | Shaft becomes a duct. **Do not build the base file's shaft marker (13.8).** | DT-S `[27.625, 32.375, 19.125, 19.500, 1.500, 12.000]`, DT-N `[27.625, 32.375, 22.500, 22.875, 1.500, 12.000]`, DT-W `[27.625, 28.000, 19.500, 22.500, 1.500, 12.000]`, DT-E `[32.000, 32.375, 19.500, 22.500, 1.500, 12.000]`. Subtract the clear box `[28.000, 32.000, 19.500, 22.500, 11.500, 12.000]` from the slab. Add the jali cap DT-CAP `[28.000, 32.000, 19.500, 22.500, 11.900, 12.000]` (MS flat-bar grid, bars 0.08 ft wide at 0.33 ft centres) |
| O6 | Openings in walls | Subtract the voids of section 4 from the wall boxes they name (or split the walls around them) |

The stair in the base file is **not** changed by any override.

## 4. Windows, Ventilators and Fan Openings

Voids to subtract from walls. Z values are absolute (floor 1.50, so a 3 ft sill is Z = 4.50).

| ID | Opening | Wall | Void box | Size (ft) | Type |
| :--- | :--- | :--- | :--- | :--- | :--- |
| WD-1 | South hallway window | W-EXT-S | `[18.000, 22.000, -0.750, 0.000, 4.500, 8.500]` | 4.0 x 4.0 | Sliding window, 2 panes, MS grill |
| WD-2 | Stairs bay window | W-EXT-S | `[28.000, 32.000, -0.750, 0.000, 4.500, 8.500]` | 4.0 x 4.0 | Sliding window, 2 panes, MS grill |
| WD-3 | Bedroom window to garden | W-INT-01 | `[3.250, 3.625, 11.375, 15.375, 4.500, 8.500]` | 4.0 x 4.0 | Sliding window, 2 panes, MS grill |
| WD-4 | Lobby window (north) | W-EXT-N | `[18.000, 22.000, 23.250, 24.000, 4.500, 8.500]` | 4.0 x 4.0 | Sliding window, 2 panes, MS grill |
| WD-5 | Kitchen window to south hallway | W-INT-06 | `[16.500, 19.500, 4.000, 4.375, 5.000, 8.000]` | 3.0 x 3.0 | Sliding window, 2 panes, no grill |
| VT-1 | West washroom ventilator (garden side) | W-INT-01 | `[3.250, 3.625, 20.250, 22.250, 7.000, 8.500]` | 2.0 x 1.5 | Ventilator: left half frosted glass, right half exhaust fan (0.75 ft dia) |
| VT-2 | East washroom ventilator (north) | W-EXT-N | `[37.000, 39.000, 23.250, 24.000, 7.000, 8.500]` | 2.0 x 1.5 | Ventilator: left half frosted glass, right half exhaust fan (0.75 ft dia) |
| VT-3 | Storeroom ventilator (north) | W-EXT-N | `[44.500, 46.500, 23.250, 24.000, 7.000, 8.500]` | 2.0 x 1.5 | Ventilator: left half frosted glass, right half exhaust fan (0.75 ft dia) |
| EF-K | Kitchen exhaust fan opening | W-INT-06 | `[20.750, 21.750, 4.000, 4.375, 7.000, 8.000]` | 1.0 x 1.0 | Exhaust fan 1.0 ft dia in a square hole |

**Window construction (applies to every void above):**

* Frame: four rails, each 0.12 ft wide and 0.25 ft deep, flush with the room-side face of the wall, material M-ALU-FRAME.
* Sliding panes: two glass boxes 0.02 ft thick, each half the width of the opening (minus the frame), in two parallel tracks 0.06 ft apart, M-GLASS. One pane is shown half-open.
* MS grill (only the windows marked "MS grill"): on the **outer** face of the wall (south face for WD-1 and WD-2, west face for WD-3, north face for WD-4). Vertical bars 0.04 x 0.04 ft at 0.333 ft centres, plus one horizontal flat 0.04 x 0.10 ft at mid height and one at the top and one at the bottom. Material M-GRILL-MS.
* Inner sill: a 0.08 ft thick granite slab (M-GRANITE-STEP) the full wall thickness deep, flush with the room-side face, 0.1 ft wider than the opening on each side.
* No chajjas (sunshades) are added: the house is built to the plot boundary, so nothing may project over the street or the neighbour.

## 5. Doors and Gates

### 5.1 Interior doors (all flush doors, closed position)

Each door has two jambs and a head (the frame), plus one leaf. The frame is 0.17 ft wide on the face and runs the full wall thickness. The leaf is 0.115 ft thick, centred in the wall, with 0.02 ft gaps. Opening heights: floor 1.50, frame head from Z = 8.33 to 8.50, leaf from Z = 1.54 to 8.31.

| ID | Room | Wall opening | Hinge | Opens toward | Leaf material |
| :--- | :--- | :--- | :--- | :--- | :--- |
| D1 | Bedroom | X 10.625 to 13.625 in W-INT-02 (Y 7.500 to 7.875) | X = 13.625 | North (into bedroom) | M-DOOR-TEAK |
| D2 | West washroom | Y 19.250 to 21.750 in W-INT-04 (X 13.625 to 14.000) | Y = 19.250 | West (into washroom) | M-DOOR-PVC |
| D3 | Kitchen | X 23.000 to 26.000 in W-INT-07 (Y 11.375 to 11.750) | X = 26.000 | South (into kitchen) | M-DOOR-TEAK |
| D4 | East washroom | X 38.750 to 41.250 in W-INT-11 (Y 18.875 to 19.250) | X = 41.250 | North (into washroom) | M-DOOR-PVC |
| D5 | Storeroom | Y 15.375 to 18.875 in W-INT-12 (X 41.250 to 41.625) | Y = 15.375 | East (into storeroom) | M-DOOR-TEAK |

Exact boxes (frame and closed leaf):

| Part | Box |
| :--- | :--- |
| D1-FJ1 | `[10.625, 10.795, 7.500, 7.875, 1.500, 8.330]` |
| D1-FJ2 | `[13.455, 13.625, 7.500, 7.875, 1.500, 8.330]` |
| D1-FH | `[10.625, 13.625, 7.500, 7.875, 8.330, 8.500]` |
| D1-LEAF | `[10.815, 13.435, 7.630, 7.745, 1.540, 8.310]` |
| D2-FJ1 | `[13.625, 14.000, 19.250, 19.420, 1.500, 8.330]` |
| D2-FJ2 | `[13.625, 14.000, 21.580, 21.750, 1.500, 8.330]` |
| D2-FH | `[13.625, 14.000, 19.250, 21.750, 8.330, 8.500]` |
| D2-LEAF | `[13.755, 13.870, 19.440, 21.560, 1.540, 8.310]` |
| D3-FJ1 | `[23.000, 23.170, 11.375, 11.750, 1.500, 8.330]` |
| D3-FJ2 | `[25.830, 26.000, 11.375, 11.750, 1.500, 8.330]` |
| D3-FH | `[23.000, 26.000, 11.375, 11.750, 8.330, 8.500]` |
| D3-LEAF | `[23.190, 25.810, 11.505, 11.620, 1.540, 8.310]` |
| D4-FJ1 | `[38.750, 38.920, 18.875, 19.250, 1.500, 8.330]` |
| D4-FJ2 | `[41.080, 41.250, 18.875, 19.250, 1.500, 8.330]` |
| D4-FH | `[38.750, 41.250, 18.875, 19.250, 8.330, 8.500]` |
| D4-LEAF | `[38.940, 41.060, 19.005, 19.120, 1.540, 8.310]` |
| D5-FJ1 | `[41.250, 41.625, 15.375, 15.545, 1.500, 8.330]` |
| D5-FJ2 | `[41.250, 41.625, 18.705, 18.875, 1.500, 8.330]` |
| D5-FH | `[41.250, 41.625, 15.375, 18.875, 8.330, 8.500]` |
| D5-LEAF | `[41.380, 41.495, 15.565, 18.685, 1.540, 8.310]` |

Hardware on every door (both faces): one stainless-steel lever handle 0.40 ft long, 0.08 ft diameter, 3.0 ft above the floor (Z = 4.50) and 0.25 ft from the latch-side jamb; three steel butt hinges 0.30 ft tall on the hinge side at Z = 2.3, 5.0 and 7.7. Door open angle for animation: 90 degrees about the hinge line, opening toward the side given in the table. Default state: closed.

The two 3.875 ft passages (bedroom-lobby, lobby-East hallway) and the garage-to-hallway opening have **no frame, no door and no arch**. Plain plastered returns only.

### 5.2 Gates (MS, painted black, M-GATE-MS)

| ID | Where | Leaves (closed) | Hinges |
| :--- | :--- | :--- | :--- |
| G1 pedestrian gate | West boundary, plane X = -0.375, opening Y 0 to 7.5 | Leaf 1 `[-0.435, -0.315, 0.020, 3.730, 0.150, 5.650]`, Leaf 2 `[-0.435, -0.315, 3.770, 7.480, 0.150, 5.650]` | Y = 0.0 and Y = 7.5 (wall faces); leaves swing inward (east) |
| G2 garage gate | South boundary, plane Y = -0.375, opening X 36.5 to 49.25 | Leaf 1 `[36.520, 42.855, -0.435, -0.315, 0.100, 7.900]`, Leaf 2 `[42.895, 49.230, -0.435, -0.315, 0.100, 7.900]` | X = 36.5 and X = 49.25; leaves swing inward (north) |

Gate leaf construction: a 0.15 ft square-tube border, vertical bars 0.06 x 0.06 ft at 0.45 ft centres, one horizontal rail 0.15 ft wide at mid height. A drop bolt and a padlock hasp on the meeting edge (0.2 ft boxes at Z = 3.0). No pillars, no lamps, no name plate.

## 6. Stair Finishes and Railing

The flight geometry stays as in the base file (12 treads, X 30.125 to 33.875, Y 4.00 to 13.24). Add only:

* **Finish:** each tread gets a 0.083 ft thick granite overlay on top (M-GRANITE-STEP), with a 0.04 ft nosing overhang at the north edge. Risers are also granite. No skirting on the west side of the flight; 0.33 ft granite skirting along the east wall (W-INT-10a).
* **Handrail:** a stainless-steel round bar 0.13 ft diameter, along the west edge of the flight, from P1 = (30.20, 4.385, 5.308) to P2 = (30.20, 12.855, 14.192). It is 3.0 ft above the tread nosing. It rises above the ground-floor slab (Z = 12.0) through the slab opening and stops at P2.
* **Balusters:** 24 stainless-steel posts 0.04 x 0.04 ft at X = 30.20. For i = 0 to 23: Y_i = 4.1925 + 0.385 i; the tread index is k = floor((Y_i - 4.0) / 0.77) + 1; the post runs from Z = 1.5 + 0.8077 k up to the handrail underside, Z = 5.308 + (Y_i - 4.385) x 1.0489 - 0.065.
* **No** half-landing, no turn, no second flight (see section 15).

## 7. Finishes and Materials

### 7.1 Finish schedule

| Area | Floor | Skirting | Walls | Ceiling |
| :--- | :--- | :--- | :--- | :--- |
| Bedroom (Z4) | M-VIT-FLOOR 2 x 2 ft tiles | 0.33 ft vitrified, same tile | M-PAINT-INT | M-PAINT-CEIL |
| Lobby (Z8), south hallway (Z6), East hallway (Z11), stairs bay west passage (Z9A), shaft alcove (Z15) | M-VIT-FLOOR 2 x 2 ft tiles | 0.33 ft vitrified | M-PAINT-INT | M-PAINT-CEIL |
| Kitchen (Z7) | M-ANTISKID 2 x 2 ft tiles | 0.33 ft vitrified | M-PAINT-INT above the dado; M-DADO-CERAMIC 1 x 2 ft glazed tiles from the platform top (Z = 4.25) up 2.0 ft (to Z = 6.25) on the south and west walls | M-PAINT-CEIL |
| West washroom (Z5), East washroom (Z12) | M-ANTISKID 1 x 1 ft tiles, sloped 1:100 to the floor drain | none | M-DADO-CERAMIC 1 x 2 ft glazed tiles from the floor to Z = 8.5 (7.0 ft) on all four walls; paint above | M-PAINT-CEIL |
| Porch (Z3) and entrance steps | M-ANTISKID 2 x 2 ft tiles; steps and risers in M-GRANITE-STEP | 0.33 ft vitrified on the walls | M-PAINT-INT | M-PAINT-CEIL |
| Storeroom (Z13) | M-KOTA, 1 x 1 ft slabs | none | M-PAINT-INT (white) | M-PAINT-CEIL |
| Garage (Z14) | M-KOTA, 1 x 1 ft slabs on the sloped wedge | none | M-EXT-PLASTER (cement paint) | M-PAINT-CEIL |
| Gate landing (Z1), garden path (Y 7.5 to 9.0) | M-KOTA, 1 x 1 ft slabs | none | n/a | open |
| Garden (Z2, Y 9.0 to 23.25) | M-GRASS ground cover | none | n/a | open |
| Exterior faces (south and east walls, garden side, north wall) | n/a | n/a | M-EXT-PLASTER on all outer faces | n/a |

Tile layout: tile grids start at the south-west corner of each room's clear floor area and run parallel to the X and Y axes. Joints 0.01 ft wide, slightly darker than the tile.

### 7.2 Material definitions (PBR)

| ID | Real material | Base colour | Roughness | Metallic |
| :--- | :--- | :--- | :--- | :--- |
| M-EXT-PLASTER | Cement plaster with texture paint, cream | #E6DCC6 | 0.90 | 0.0 |
| M-PAINT-INT | Interior emulsion, light cream | #F1E9D8 | 0.85 | 0.0 |
| M-PAINT-CEIL | Ceiling emulsion, white | #FBFAF6 | 0.90 | 0.0 |
| M-VIT-FLOOR | Vitrified tile, light beige-grey, polished | #D9D2C5 | 0.25 | 0.0 |
| M-ANTISKID | Matte anti-skid ceramic, warm grey | #BDB5A6 | 0.65 | 0.0 |
| M-DADO-CERAMIC | Glazed wall tile, off-white | #EEECE6 | 0.15 | 0.0 |
| M-KOTA | Kota stone, grey-green | #7D8574 | 0.60 | 0.0 |
| M-GRANITE-STEP | Black granite, honed | #262626 | 0.35 | 0.0 |
| M-GRANITE-BLACK | Black granite platform, polished | #1B1B1B | 0.15 | 0.0 |
| M-GRASS | Lawn grass | #4F7A32 | 0.95 | 0.0 |
| M-DOOR-TEAK | Teak veneer flush door | #8B5A2B | 0.55 | 0.0 |
| M-DOOR-PVC | White PVC washroom door | #ECE9DF | 0.40 | 0.0 |
| M-FRAME-WOOD | Hardwood door frame, dark | #5A3A1E | 0.60 | 0.0 |
| M-ALU-FRAME | Anodised aluminium window frame, silver-grey | #9A9DA0 | 0.35 | 0.8 |
| M-GLASS | 5 mm clear glass | #CFE3E8 at 15 percent opacity | 0.05 | 0.0 |
| M-GRILL-MS | MS grill, black paint | #222222 | 0.45 | 0.6 |
| M-GATE-MS | MS gate, black paint | #1F1F1F | 0.45 | 0.6 |
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
| M-CAR-SILVER | Car paint, silver | #B9BDC2 | 0.25 | 0.6 |
| M-SCOOTER-RED | Scooter paint, red | #A42A24 | 0.35 | 0.3 |
| M-TYRE-BLACK | Car tyre, black rubber | #1A1A1A | 0.85 | 0.0 |
| M-CEMENT-PAINT | Painted cement planter, white | #E8E4DA | 0.85 | 0.0 |
| M-TERRACOTTA | Terracotta pot with green foliage on top | #B5683E | 0.80 | 0.0 |

## 8. Room-by-Room Interior

Every box below is solid, absolute coordinates, on the room's floor. Names include real-world sizes. Heights above the floor are in the name where the item is wall-mounted.

### 8.1 Bedroom (Z4)

Layout: bed head on the north wall, wardrobe on the south wall west of the door, curtain on the garden window. Clear distances: 2.5 ft between wardrobe and bed foot, 1.75 ft between the west wall and the bed, 3.1 ft between the bed and the east wall.

| ID | Item | Box | Material |
| :--- | :--- | :--- | :--- |
| BED-01 | Queen bed frame 5.0 x 6.5 ft, headboard on north wall | `[5.375, 10.375, 12.375, 18.875, 1.500, 2.500]` | M-WOOD-DARK |
| BED-02 | Mattress 4.85 x 6.35 ft | `[5.450, 10.300, 12.450, 18.800, 2.500, 3.200]` | M-FABRIC-BEIGE |
| BED-03 | Headboard 5.0 ft wide, 3.5 ft above floor | `[5.375, 10.375, 18.625, 18.875, 1.500, 5.000]` | M-WOOD-DARK |
| BED-04 | Pillow 1 | `[5.800, 7.800, 17.900, 18.600, 3.200, 3.550]` | M-FABRIC-WHITE |
| BED-05 | Pillow 2 | `[8.000, 10.000, 17.900, 18.600, 3.200, 3.550]` | M-FABRIC-WHITE |
| BED-06 | Bedside table, west 1.5 x 1.5 ft | `[3.750, 5.250, 17.375, 18.875, 1.500, 3.250]` | M-WOOD-DARK |
| BED-07 | Bedside table, east 1.5 x 1.5 ft | `[10.500, 12.000, 17.375, 18.875, 1.500, 3.250]` | M-WOOD-DARK |
| BED-08 | Wardrobe 6.0 ft wide x 2.0 ft deep x 7.0 ft high | `[3.750, 9.750, 7.875, 9.875, 1.500, 8.500]` | M-LAMINATE-WALNUT |
| BED-09 | Curtain, west window (hung 0.15 ft off the wall) | `[3.650, 3.800, 10.875, 15.875, 1.600, 8.800]` | M-FABRIC-CURTAIN |

### 8.2 West washroom (Z5)

Layout along the north wall from west to east: shower, WC, basin. The door swing (X 11.0 to 13.625, Y 19.25 to 21.75) stays clear. The shower has no curtain or glass; the wet area is the west 3.4 ft.

| ID | Item | Box | Material |
| :--- | :--- | :--- | :--- |
| WW-01 | Western WC, floor mounted, 1.25 x 2.25 ft | `[8.000, 9.250, 21.000, 23.250, 1.500, 2.900]` | M-SANITARY-WHITE |
| WW-02 | Wash basin bowl 1.75 x 1.3 ft | `[10.000, 11.750, 21.950, 23.250, 3.500, 4.250]` | M-SANITARY-WHITE |
| WW-03 | Basin pedestal | `[10.500, 11.250, 22.500, 23.000, 1.500, 3.500]` | M-SANITARY-WHITE |
| WW-04 | Mirror 1.5 x 2.0 ft above basin | `[10.100, 11.650, 23.150, 23.250, 5.500, 7.500]` | M-MIRROR |
| WW-05 | Electric geyser 15 L above WC | `[8.100, 9.000, 22.350, 23.250, 7.000, 8.400]` | M-SANITARY-WHITE |
| WW-06 | Shower head 0.5 ft dia, on north wall x=5.3 | `[5.050, 5.550, 22.300, 22.800, 7.850, 7.900]` | M-CHROME |
| WW-07 | Shower arm | `[5.200, 5.400, 22.800, 23.250, 7.900, 8.000]` | M-CHROME |
| WW-08 | Shower mixer valve | `[5.100, 5.500, 23.100, 23.250, 4.800, 5.100]` | M-CHROME |
| WW-09 | Floor drain grate 0.4 x 0.4 ft | `[5.100, 5.500, 21.050, 21.450, 1.500, 1.520]` | M-STEEL-SS |

### 8.3 East washroom (Z12)

Layout along the north wall from west to east: shower, WC, basin. The door swing (X 38.75 to 41.25, Y 19.25 to 21.75) stays clear.

| ID | Item | Box | Material |
| :--- | :--- | :--- | :--- |
| EW-01 | Western WC, floor mounted, 1.25 x 2.25 ft | `[36.750, 38.000, 21.000, 23.250, 1.500, 2.900]` | M-SANITARY-WHITE |
| EW-02 | Wash basin bowl 1.75 x 1.3 ft | `[39.400, 41.150, 21.950, 23.250, 3.500, 4.250]` | M-SANITARY-WHITE |
| EW-03 | Basin pedestal | `[39.900, 40.650, 22.500, 23.000, 1.500, 3.500]` | M-SANITARY-WHITE |
| EW-04 | Mirror 1.5 x 2.0 ft above basin | `[39.500, 41.000, 23.150, 23.250, 5.500, 7.500]` | M-MIRROR |
| EW-05 | Electric geyser 15 L on east wall | `[40.350, 41.250, 22.200, 23.100, 7.000, 8.400]` | M-SANITARY-WHITE |
| EW-06 | Shower head 0.5 ft dia, on north wall x=35.3 | `[35.050, 35.550, 22.300, 22.800, 7.850, 7.900]` | M-CHROME |
| EW-07 | Shower arm | `[35.200, 35.400, 22.800, 23.250, 7.900, 8.000]` | M-CHROME |
| EW-08 | Shower mixer valve | `[35.100, 35.500, 23.100, 23.250, 4.800, 5.100]` | M-CHROME |
| EW-09 | Floor drain grate 0.4 x 0.4 ft | `[35.100, 35.500, 21.000, 21.400, 1.500, 1.520]` | M-STEEL-SS |

### 8.4 Kitchen (Z7)

L-shaped platform: south leg 10.0 x 2.0 ft, west leg 2.0 x 5.0 ft, top 2.75 ft above the floor. Sink under window WD-5, hob under exhaust fan EF-K. Door swing (X 23 to 26, Y 8.375 to 11.375) stays clear.

| ID | Item | Box | Material |
| :--- | :--- | :--- | :--- |
| KIT-01 | Base cabinet, south leg, 10.0 x 2.0 ft | `[14.000, 24.000, 4.375, 6.375, 1.500, 4.100]` | M-LAMINATE-GREY |
| KIT-02 | Granite platform top, south leg (0.075 ft overhang) | `[14.000, 24.000, 4.375, 6.450, 4.100, 4.250]` | M-GRANITE-BLACK |
| KIT-03 | Base cabinet, west leg, 2.0 x 5.0 ft | `[14.000, 16.000, 6.375, 11.375, 1.500, 4.100]` | M-LAMINATE-GREY |
| KIT-04 | Granite platform top, west leg | `[14.000, 16.075, 6.375, 11.375, 4.100, 4.250]` | M-GRANITE-BLACK |
| KIT-05 | Double-bowl steel sink 2.5 x 1.6 ft (recessed 0.7 ft) | `[16.500, 19.000, 4.600, 6.200, 3.550, 4.250]` | M-STEEL-SS |
| KIT-06 | Sink tap | `[17.600, 17.900, 4.400, 4.900, 4.250, 5.000]` | M-CHROME |
| KIT-07 | 4-burner gas hob 2.0 x 1.6 ft | `[20.250, 22.250, 4.600, 6.200, 4.250, 4.350]` | M-GLASS-BLACK |
| KIT-08 | Wall cabinet over west leg | `[14.000, 15.000, 6.500, 11.000, 6.250, 8.500]` | M-LAMINATE-GREY |
| KIT-09 | Wall cabinet, south wall west of window | `[14.000, 16.250, 4.375, 5.375, 6.250, 8.500]` | M-LAMINATE-GREY |
| KIT-10 | Wall cabinet, south wall east of fan | `[22.750, 24.000, 4.375, 5.375, 6.250, 8.500]` | M-LAMINATE-GREY |
| KIT-11 | Refrigerator, single door 1.8 x 2.0 x 5.5 ft | `[24.200, 26.000, 4.375, 6.400, 1.500, 7.000]` | M-STEEL-SS |

### 8.5 Lobby: living and dining (Z8)

Living nook in the north-east corner (sofa faces the TV on the east wall), dining set in the south band. The 3.9 ft axis from the bedroom passage to the East hallway opening (Y 15.0 to 18.875) stays free except for chair backs (tucked chairs reach Y = 16.0).

| ID | Item | Box | Material |
| :--- | :--- | :--- | :--- |
| LOB-01 | Two-seat sofa seat base, faces east 2.75 x 4.2 ft | `[16.250, 19.000, 19.000, 23.200, 1.500, 2.100]` | M-FABRIC-GREY |
| LOB-02 | Sofa seat cushions | `[16.950, 19.000, 19.500, 22.700, 2.100, 3.000]` | M-FABRIC-GREY |
| LOB-03 | Sofa back | `[16.250, 17.000, 19.000, 23.200, 2.100, 4.300]` | M-FABRIC-GREY |
| LOB-04 | Sofa arm, south | `[16.950, 19.000, 19.000, 19.500, 2.100, 3.600]` | M-FABRIC-GREY |
| LOB-05 | Sofa arm, north | `[16.950, 19.000, 22.700, 23.200, 2.100, 3.600]` | M-FABRIC-GREY |
| LOB-06 | Centre table 2.0 x 2.0 x 1.3 ft | `[20.500, 22.500, 20.200, 22.200, 1.500, 2.800]` | M-WOOD-DARK |
| LOB-07 | TV unit 1.25 x 4.0 x 1.3 ft against east wall | `[24.750, 26.000, 19.100, 23.100, 1.500, 2.800]` | M-LAMINATE-WALNUT |
| LOB-08 | 55-inch TV, wall mounted (4.0 x 2.3 ft panel) | `[25.850, 26.000, 19.150, 23.050, 3.850, 6.150]` | M-GLASS-BLACK |
| LOB-09 | Dining table top 4.0 x 2.5 ft, 2.5 ft high | `[17.500, 21.500, 12.500, 15.000, 3.800, 4.000]` | M-WOOD-DARK |
| LOB-10 | Dining table leg | `[17.500, 17.700, 12.500, 12.700, 1.500, 3.800]` | M-WOOD-DARK |
| LOB-11 | Dining table leg | `[21.300, 21.500, 12.500, 12.700, 1.500, 3.800]` | M-WOOD-DARK |
| LOB-12 | Dining table leg | `[17.500, 17.700, 14.800, 15.000, 1.500, 3.800]` | M-WOOD-DARK |
| LOB-13 | Dining table leg | `[21.300, 21.500, 14.800, 15.000, 1.500, 3.800]` | M-WOOD-DARK |
| LOB-14 | Dining chair, north side, left | `[17.750, 19.250, 14.500, 16.000, 1.500, 3.100]` | M-WOOD-DARK |
| LOB-15 | Dining chair, north side, right | `[19.750, 21.250, 14.500, 16.000, 1.500, 3.100]` | M-WOOD-DARK |
| LOB-16 | Dining chair, south side, left | `[17.750, 19.250, 11.750, 13.250, 1.500, 3.100]` | M-WOOD-DARK |
| LOB-17 | Dining chair, south side, right | `[19.750, 21.250, 11.750, 13.250, 1.500, 3.100]` | M-WOOD-DARK |

### 8.6 Storeroom (Z13)

Steel racks 5.5 ft high on the north and east walls only (their tops stay level with the VT-3 ventilator sill, Z = 7.0). The door swing stays clear.

| ID | Item | Box | Material |
| :--- | :--- | :--- | :--- |
| STO-01 | Steel rack along north wall 7.25 x 1.5 ft, 5.5 ft high | `[42.000, 49.250, 21.750, 23.250, 1.500, 7.000]` | M-STEEL-GREY |
| STO-02 | Steel rack along east wall 1.5 x 6.375 ft | `[47.750, 49.250, 15.375, 21.750, 1.500, 7.000]` | M-STEEL-GREY |

### 8.7 Porch (Z3)

One item. The porch is otherwise empty.

| ID | Item | Box | Material |
| :--- | :--- | :--- | :--- |
| POR-01 | Shoe rack 3.0 x 1.0 ft, 3.0 ft high | `[8.000, 11.000, 0.000, 1.000, 1.500, 4.500]` | M-WOOD-DARK |

### 8.8 Garage (Z14)

The car and the scooter stand on the sloped floor. The body boxes are level approximations; the four wheels follow the slope (axle 1.0 ft above the wedge top). Wheels are cylinders with their axis along X; the box is their bounding box.

| ID | Item | Box | Material |
| :--- | :--- | :--- | :--- |
| GAR-01 | Hatchback body (12.5 x 5.5 ft), lower | `[40.125, 45.625, 1.000, 13.500, 0.750, 2.700]` | M-CAR-SILVER |
| GAR-02 | Hatchback cabin | `[40.600, 45.150, 3.500, 10.000, 2.700, 4.700]` | M-CAR-SILVER |
| GAR-04 | Wheel front-left (cylinder, axis along X, radius 1.0 ft, 0.7 ft wide), bounding box | `[40.150, 40.850, 2.000, 4.000, 0.100, 2.100]` | M-TYRE-BLACK |
| GAR-05 | Wheel front-right | `[44.900, 45.600, 2.000, 4.000, 0.100, 2.100]` | M-TYRE-BLACK |
| GAR-06 | Wheel rear-left | `[40.150, 40.850, 10.500, 12.500, 0.383, 2.383]` | M-TYRE-BLACK |
| GAR-07 | Wheel rear-right | `[44.900, 45.600, 10.500, 12.500, 0.383, 2.383]` | M-TYRE-BLACK |
| GAR-03 | Scooter 6.0 x 2.0 ft | `[35.000, 37.000, 2.000, 8.000, 0.200, 3.400]` | M-SCOOTER-RED |

### 8.9 Garden (Z2)

Grass elsewhere; kota stone path Y 7.5 to 9.0.

| ID | Item | Box | Material |
| :--- | :--- | :--- | :--- |
| GRD-01 | Tulsi planter (Vrindavan) 1.5 x 1.5 ft, 3.5 ft high | `[0.900, 2.400, 9.600, 11.100, 0.000, 3.500]` | M-CEMENT-PAINT |
| GRD-02 | Potted plant 1 (0.8 ft pot + foliage) | `[1.200, 2.000, 16.000, 16.800, 0.000, 2.500]` | M-TERRACOTTA |
| GRD-03 | Potted plant 2 | `[1.200, 2.000, 18.300, 19.100, 0.000, 2.500]` | M-TERRACOTTA |
| GRD-04 | Potted plant 3 | `[1.200, 2.000, 20.600, 21.400, 0.000, 2.500]` | M-TERRACOTTA |

## 9. Electrical and Lighting

### 9.1 Ceiling fans (3 blades, 1200 mm sweep)

Each fan assembly hangs from the slab underside (Z = 11.5): canopy cylinder radius 0.25 ft, Z 11.25 to 11.50; down-rod radius 0.04 ft, Z 10.75 to 11.25; hub cylinder radius 0.30 ft, Z 10.60 to 10.75; three blades 0.40 ft wide, 0.03 ft thick, from radius 0.30 to 1.97 ft at Z = 10.62, 120 degrees apart. Blade tips are above 10.6 ft, well over head height.

| ID | Room | Centre (X, Y) |
| :--- | :--- | :--- |
| FN-1 | Bedroom | (8.625, 13.375) |
| FN-2 | Lobby, over the dining table | (19.500, 14.000) |
| FN-3 | Lobby, over the sofa | (20.500, 21.000) |

### 9.2 Ceiling lights

LED panels are flat boxes 0.06 ft thick at Z 11.44 to 11.50, white, emissive (warm white, 4000 K). The garage uses a 4 ft LED batten.

| ID | Room | Centre (X, Y) | Size (X x Y, ft) |
| :--- | :--- | :--- | :--- |
| LT-1 | Bedroom | (8.625, 16.500) | 2 x 2 |
| LT-2 | Lobby west | (17.000, 17.000) | 2 x 2 |
| LT-3 | Lobby east | (23.000, 17.000) | 2 x 2 |
| LT-4 | Kitchen | (20.000, 7.875) | 2 x 2 |
| LT-5 | West washroom | (8.625, 21.250) | 1 x 1 |
| LT-6 | East washroom | (37.750, 21.250) | 1 x 1 |
| LT-7 | Storeroom | (45.400, 19.300) | 2 x 2 |
| LT-8 | Garage (batten, long side along X) | (42.000, 7.500) | 4 x 0.3 |
| LT-9 | South hallway | (20.000, 2.000) | 2 x 2 |
| LT-10 | Stairs bay foot | (30.000, 2.000) | 2 x 2 |
| LT-11 | Porch | (8.000, 3.750) | 2 x 2 |
| LT-12 | East hallway west | (31.000, 16.900) | 2 x 2 |
| LT-13 | East hallway east | (38.000, 16.900) | 2 x 2 |

### 9.3 Switchboards and distribution board

Modular switch plates 0.4 x 0.4 ft, 0.1 ft proud of the wall, white, at Z 5.3 to 5.7 (4.0 to 4.4 ft above the floor). One per room, next to the door on the latch side.

| ID | Room | Box |
| :--- | :--- | :--- |
| SB-BED | Bedroom | `[9.850, 10.250, 7.875, 7.975, 5.300, 5.700]` |
| SB-WW | West washroom | `[13.525, 13.625, 22.000, 22.400, 5.300, 5.700]` |
| SB-KIT | Kitchen | `[22.400, 22.800, 11.275, 11.375, 5.300, 5.700]` |
| SB-LOB | Lobby | `[22.400, 22.800, 11.750, 11.850, 5.300, 5.700]` |
| SB-EW | East washroom | `[38.000, 38.400, 19.250, 19.350, 5.300, 5.700]` |
| SB-STO | Storeroom | `[41.625, 41.725, 19.200, 19.600, 5.300, 5.700]` |
| SB-GAR | Garage | `[34.250, 34.350, 10.000, 10.400, 4.500, 4.900]` |
| SB-HALL | South hallway | `[24.000, 24.400, 3.900, 4.000, 5.300, 5.700]` |
| MAIN-DB | Main distribution board (East hallway), 0.8 x 1.0 ft, metal box | `[35.000, 35.800, 18.775, 18.875, 5.000, 6.000]` |

No visible wiring, conduits, sockets or cables are modelled. They are inside the walls.

## 10. Exterior and Garden

* All outer wall faces: M-EXT-PLASTER, plain, no band, no cornice, no name plate, no chajja.
* The south front (the street face) is one plain plastered wall with two windows (WD-1, WD-2) and the garage gate.
* West boundary wall (6.0 ft): plain plaster on both faces, flat top, no coping, no spikes.
* Garden: kota path Y 7.5 to 9.0, grass Y 9.0 to 23.25, one tulsi planter, three potted plants (section 8.9). No trees, no benches, no lights.
* Street: not modelled. Nothing outside the plot boundary.

## 11. What NOT to Add

Do not add: columns, beams, chajjas, air conditioners, curtains other than BED-09, rugs, carpets, wall art, photo frames, plants other than GRD-01 to GRD-04, a bathtub, a washing machine, a television in any room other than the lobby, a main door, an upper floor, a roof parapet, a water tank, an inverter, CCTV, signage, people, animals, or any item not listed in this file or the base file.

## 12. Build Order for This File

Apply after the base file's section 13 recipe is complete:

1. Section 3 overrides O1 to O5 (change or add the listed boxes).
2. Section 4 voids (subtract from walls). Re-split wall pieces as needed so the geometry stays clean.
3. Window frames, panes, grills and sills (section 4 construction rules).
4. Door frames, leaves and hardware (section 5.1), then gates (5.2).
5. Stair finish, balusters and handrail (section 6).
6. Assign finishes and materials by area (section 7).
7. Rooms in the order of section 8, item by item.
8. Fans, lights, switchboards and the distribution board (section 9).
9. Exterior and garden (section 10).
10. Verification (section 13).

## 13. Verification

**Counts**

| Group | Count |
| :--- | :--- |
| Room items (section 8) | 69 |
| Wall voids (section 4) | 9 |
| Doors (frame 3 boxes + leaf) | 5 |
| Gates (2 leaves each) | 2 |
| Duct boxes (4 walls + cap) | 5 |
| Ceiling fans | 3 |
| Ceiling lights | 13 |
| Switchboards and DB | 9 |
| Stair balusters | 24, plus 1 handrail |
| New solids from overrides O3, O4 | 3 |

**Programmatic checks that passed on this data**

1. Every room item lies inside its room's clear floor area (section 4 of the base file) and below the ceiling.
2. No two items from different furniture sets overlap in the same room. (Chairs and the table legs, sink and platform, bed parts and sofa parts intentionally belong to one set each.)
3. No item enters a door swing zone: D1 `X 10.625-13.625, Y 7.875-10.875`; D2 `X 11.0-13.625, Y 19.25-21.75`; D3 `X 23.0-26.0, Y 8.375-11.375`; D4 `X 38.75-41.25, Y 19.25-21.75`; D5 `X 41.625-44.75, Y 15.375-18.5`.
4. A 1.2 ft wide walker can follow every route in the table below without touching a wall or an item at body height.

| # | Route | Waypoints (X, Y) |
| :--- | :--- | :--- |
| 1 | Gate landing to porch to bedroom | (1.6, 3.75) -> (8.0, 3.75) -> (12.1, 3.75) -> (12.1, 9.0) -> (11.8, 11.2) -> (8.0, 11.2) |
| 2 | Bedroom to lobby | (8.0, 11.2) -> (11.8, 11.2) -> (11.8, 16.3) -> (13.8, 16.9) -> (20.0, 16.9) |
| 3 | Lobby to kitchen | (20.0, 16.9) -> (24.5, 16.9) -> (24.5, 10.5) -> (20.0, 8.0) |
| 4 | Lobby to West washroom | (15.0, 16.9) -> (15.0, 20.5) -> (13.8, 20.5) -> (11.0, 20.2) -> (5.5, 20.2) |
| 5 | Porch to south hallway to stairs bay to East hallway | (12.1, 3.75) -> (12.1, 2.0) -> (28.0, 2.0) -> (28.0, 16.9) -> (36.0, 16.9) |
| 6 | East hallway to garage | (36.0, 16.9) -> (36.0, 10.0) |
| 7 | East hallway to East washroom | (40.0, 16.9) -> (40.0, 19.06) -> (40.0, 20.6) -> (38.5, 20.2) |
| 8 | East hallway to storeroom | (36.0, 16.9) -> (41.44, 16.9) -> (44.5, 17.2) |
| 9 | Garage to street (between scooter and car) | (38.5, 10.0) -> (38.5, -1.5) |
| 10 | Lobby to East hallway | (24.5, 16.9) -> (30.0, 16.9) -> (36.0, 16.9) |
| 11 | Lobby axis to the sofa and TV zone | (15.0, 16.9) -> (19.8, 18.3) -> (19.8, 20.0) |

**Visual checks**

* Standing in the bedroom doorway, the bed headboard, wardrobe, west window and curtain are visible; the wardrobe is left, the bed ahead.
* The kitchen has an L-shaped black granite platform; the sink is directly under window WD-5, the hob directly under the exhaust fan EF-K.
* The lobby sofa faces east toward the TV on the east wall; the dining table is in the south half, chairs on the north and south sides.
* Every washroom has a WC, a basin with mirror above, a geyser, a ventilator with exhaust fan and a floor drain, and nothing else.
* From the street (south) the house shows two windows with black grills and the garage gate; the pedestrian gate is on the west.

## 14. Assumption Register for This File

All [IN]. If the owner contradicts any row, change only the listed boxes.

| Item | Value | Where it appears |
| :--- | :--- | :--- |
| Window size and sill | 4 x 4 ft, sill 3 ft above floor | Section 4 |
| Ventilator size and level | 2 x 1.5 ft, sill 5.5 ft above floor | Section 4 |
| Door sizes | 3.0, 2.5, 3.5 ft x 7 ft | Section 5 |
| Gate heights | 5.5 ft pedestrian, 7.8 ft garage | Section 5.2 |
| Garden boundary wall | 6.0 ft | O1 |
| Garage steps | two of about 6" | O4 |
| Duct | 4 x 3 ft clear, centre (30, 21) | O5 |
| Kitchen platform | 2.0 ft deep, 2.75 ft high, granite | Section 8.4 |
| Fan sweep | 1200 mm | Section 9.1 |
| Light type | LED, warm white | Section 9.2 |
| Colours | Cream paint, beige-grey tiles, black granite | Section 7 |

## 15. Still Not Resolved

These cannot be answered from a ground-floor plan, and this file does not guess them:

1. **The real staircase.** A 10.5 ft floor-to-floor rise cannot be climbed by a straight 9.2 ft flight at normal riser heights. In an Indian house this is almost always a dog-leg stair with a half-landing, but the bay looks too shallow to hold one at normal landing size, so the real stair probably differs from what the plan shows. The base file keeps the drawn flight (which reaches the slab top at a steep 9.7" per riser) and this file adds nothing above it. Send the upper-floor plan to settle this.
2. **The south wall's east end** (X = 26 or 36.5, section 5.1 of the base file).
3. **Window positions.** They are the standard choice, not read from the plan, so they must be checked against the owner's wishes.
4. **Furniture.** Typical but not specific; it is a layout, not a record of what is there.
