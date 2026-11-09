# 3D House Simulation Architecture

A modular, extensible Three.js + Vite architectural simulation engine for multi-storey residential buildings, built to exact CAD specifications.

---

## 🎮 Controls & Keyboard Shortcuts

### First-Person Exploration Mode

| Key / Action | Action Description |
| :--- | :--- |
| <kbd>W</kbd> or <kbd>↑</kbd> | Move Forward |
| <kbd>S</kbd> or <kbd>↓</kbd> | Move Backward |
| <kbd>A</kbd> or <kbd>←</kbd> | Strafe Left |
| <kbd>D</kbd> or <kbd>→</kbd> | Strafe Right |
| <kbd>Shift</kbd> (Hold) | Sprint / Walk Fast |
| <kbd>Space</kbd> | Jump |
| <kbd>E</kbd> | **Interact** (Doors, Gates, Sinks, Beds, Seating, Toilets, Curtains, Almirahs, Cupboards, Drawers) |
| <kbd>H</kbd> | **Toggle Interaction Prompt** (Show/hide the "[E] Interact" hint on screen) |
| **Mouse Move** | Look around (Yaw & Pitch) |
| **Left Click** | Lock mouse cursor & enter walk mode (or interact with doors) |
| <kbd>Esc</kbd> | Release mouse cursor & pause navigation |

### View & Simulation Hotkeys

| Shortcut | Function | Description |
| :--- | :--- | :--- |
| <kbd>V</kbd> | **Toggle Camera Mode** | Switch between **First-Person Walk** and **Dollhouse Orbit View** |
| <kbd>5</kbd> or <kbd>P</kbd> | **Cycle POV Perspective** | Cycle between **First-Person**, **Third-Person (Back)**, and **Third-Person (Front)** |
| <kbd>1</kbd> | **Isolate Ground Floor** | Isolate Ground Floor in Dollhouse overview (auto-switches to Dollhouse if in FP) |
| <kbd>2</kbd> | **Isolate First Floor** | Isolate First Floor in Dollhouse overview (auto-switches to Dollhouse if in FP) |
| <kbd>3</kbd> or <kbd>0</kbd> | **Show Both Floors** | Display the full two-storey residential building in Dollhouse overview |
| <kbd>C</kbd> | **Toggle Roof Slab** | Show/hide top roof slab and terrace parapets to look inside from above |
| <kbd>L</kbd> | **Toggle Room Labels** | Show/hide 3D architectural room name badges (OFF by default for clean immersion) |
| <kbd>H</kbd> | **Toggle Interaction Prompt** | Toggle the on-screen "[E] Interact" hint prompt without affecting room labels |
| <kbd>F</kbd> | **Toggle Furniture** | Show/hide interior fitout (furniture, fixtures, appliances, doors, fans) |
| <kbd>R</kbd> | **Reset Position** | Teleport player back to the default spawn point (Gate Landing) |

### Dollhouse / Orbit Camera Controls

| Mouse Action | Effect |
| :--- | :--- |
| **Left Click + Drag** | Orbit / Rotate camera around the house |
| **Left Click on Door/Gate/Car** | Interactively open / close door, gate, motorized garage door, or enter car |
| **Right Click + Drag** | Pan camera horizontally and vertically |
| **Scroll Wheel** | Zoom in / Zoom out |

### 🚗 Vehicle Driving Controls (When Inside Car)

| Shortcut | Action | Description |
| :--- | :--- | :--- |
| <kbd>E</kbd> | **Enter / Exit Car** | Approach the driver's side (right side, Indian RHD) on foot to enter (`[E] Enter Car`), or click in Orbit mode. Press <kbd>E</kbd> while driving to park the vehicle, stop the engine, and safely step out beside the driver's door on the right. |
| <kbd>W</kbd> or <kbd>↑</kbd> | **Accelerate Forward** | Accelerates the vehicle smoothly up to 16 mph; spins all 4 wheels; dynamically revs engine sound pitch with speed. |
| <kbd>S</kbd> or <kbd>↓</kbd> | **Brake / Reverse** | Brakes strongly when moving forward; reverses backward when stopped. |
| <kbd>A</kbd> or <kbd>←</kbd> | **Steer Left** | Turns front wheels and cockpit steering wheel smoothly to the left with realistic bicycle turning physics. |
| <kbd>D</kbd> or <kbd>→</kbd> | **Steer Right** | Turns front wheels and cockpit steering wheel smoothly to the right with spring-back auto-centering. |
| <kbd>Space</kbd> | **Handbrake** | Emergency handbrake for instant responsive stopping. |
| <kbd>C</kbd> or <kbd>5</kbd> / <kbd>P</kbd> | **Toggle Camera View** | Switch between First-Person **Cockpit Driver View** (sitting in the front right seat behind the wheel with 100% unobstructed open sightlines and 360° mouse freelook) and Third-Person **Chase Cam** (cinematic chase view behind and above the car). |
| <kbd>L</kbd> | **Toggle Headlights** | Turn on/off bright dual round LED projector headlights with dynamic Three.js SpotLights illuminating the garage, walls, and street. |
| <kbd>H</kbd> | **Honk Horn** | Plays authentic dual-tone automotive horn sound (`440 Hz` + `554 Hz`). |
| <kbd>G</kbd> | **Garage Door Remote** | Remotely open or close the motorized overhead garage door `G2` from inside the car to drive out to the street and park back in. |
| **Mouse Move** | **Look Around** | Look around in 360° inside the cockpit (looking at windshield, mirrors, and dashboard) or rotate chase camera. |

### Interactive UI & Architecture Features

* **Interactive Doors, Boundary Gates & Motorized Garage System**:
  * **Motorized Overhead Sectional Garage Door**:
    * Authentic residential overhead roll-up sectional mechanism replacing swinging leaves.
    * 5 horizontal articulating panels in architectural dark charcoal steel (`M-GATE-MS`) with embossed shadow grooves, 4 upper frosted glass vision lites (`M-GLASS`), bottom rubber bulb weather seal, recessed flush handle, and side roller hinges.
    * Structural C-channel vertical guide jamb tracks, top lintel torsion drum shaft, motorized opener unit, and horizontal ceiling runners extending into the garage.
    * Lifts smoothly vertically **UP** ($7.60$ ft lift height) into ceiling clearance when activated, clearing the full 12.7 ft driveway width for vehicle and player passage.
    * Realistic mechanical audio via Web Audio API featuring electric motor hum combined with chain and roller track rumble.
    * Dynamic collision integration: solid physical barrier when closed; dynamically deactivated when open for smooth walk-through / drive-through.
  * **Interactive Pedestrian Entrance Gate (<kbd>G1</kbd>)**: Dual-leaf mild steel boundary gate with solid kick plates, horizontal privacy slats, and vertical stainless steel pull handles.
  * **Interactive Exterior East Entrance Door (<kbd>D7</kbd>)**: A solid teak entrance door on the east exterior wall directly facing the central staircase flight passage, complete with wooden jamb frame, lintel, exterior granite landing step, and dynamic collision integration for smooth outside-to-hallway entry.
  * **Interactive Glazed Balcony Doors (<kbd>DF3</kbd>, <kbd>DF8</kbd>)**: Powder-coated aluminum framed doors with full-height safety glass panels leading to exterior first-floor balconies.
  * **Interior Flush Doors**: Solid teak doors with stainless steel lever handles and realistic latch audio.
  * **Dual Interaction Support**: Walk up in First-Person mode and press <kbd>E</kbd> or click; in Dollhouse / Orbit mode, simply left-click directly on any door or gate leaf.
* **Interactive Sinks & Running Water System**:
  * **8 Interactive Sinks & Basins**: Operating taps across Ground Floor and First Floor (Ground Floor Kitchen, South Bathroom, North Bathroom, First Floor Kitchen, Basin Niche, Bathrooms 1 & 2, and West Gallery).
  * **Enhanced 3D Sink & Basin Architectures**:
    * **Kitchen Stainless Steel Sinks (`KIT-05`, `KF-05`)**: Dual deep hollow basins recessed into the granite counter with perimeter mounting rim lip, center saddle, chrome basket strainers with drain perforations, and fluted drainer run-off grooves.
    * **Bathroom Ceramic Washbasins (`WW-02`, `EW-02`, etc.)**: Sculpted sanitary white ceramic bowls with hollow recessed cavity, chrome pop-up drain stopper disc, rear overflow drain hole with chrome escutcheon, and soap deck indents.
    * **Ceramic Pedestal Columns (`WW-03`, `EW-03`, etc.)**: Tapered architectural pedestals with flared floor plinth footing and fluted column styling.
  * **Orientation-Aware Mixer Taps**: Gooseneck spouts curve gracefully into the center of each hollow basin based on wall orientation (North, South, or East), aligning the animated water stream and expanding splash ripples directly over the drain strainer.
  * **Procedural Running Water Simulation**: Turning on any tap displays an animated shimmering translucent water stream with dynamic pulsing and expanding basin splash ripple rings.
  * **Web Audio Sound Synthesis**: Built-in procedural audio synthesizing tap lever clicks and realistic running water hiss/trickle using modulated bandpass noise filters without needing external audio files.
  * **Dual Interaction Support**: Approach any sink in First-Person mode and press <kbd>E</kbd> (or left-click), or click directly on any tap in Dollhouse / Orbit mode.
* **Interactive Beds, Seating & Toilet System**:
  * **Accurate Sleeping Mechanism (Beds)**: Approach any bed (Ground Floor Bedroom Queen Bed, First Floor Master King Bed, or Child Bedroom Bed) and press <kbd>E</kbd> to sleep. The avatar transitions into an anatomically accurate horizontal lying pose flat on the mattress with head resting on the pillow, arms relaxed, and subtle chest-rise breathing motion, accompanied by procedural blanket rustle audio. Supports both First-Person bed view and Third-Person (toggled with <kbd>5</kbd>) views. Press <kbd>E</kbd>, <kbd>Space</kbd>, or any movement key (<kbd>W</kbd>/<kbd>A</kbd>/<kbd>S</kbd>/<kbd>D</kbd>) to smoothly stand up beside the bed.
  * **All Sofas & Chairs Interactive**: Approach any sofa (Ground Floor Living Room Sofa or First Floor Lobby Sofa), dining chair (all 10 dining chairs across GF and 1F), or study desk chair and press <kbd>E</kbd> to sit. Full-bounding-box reach detection allows approaching any part of the sofa. Camera lowers to seated eye-level, avatar drops hips onto cushion with thighs horizontal and knees bent 90° down with feet on the floor, accompanied by soft cushion compression audio. Look around freely with mouse while seated; press <kbd>E</kbd>, <kbd>Space</kbd>, or movement keys to stand up.
  * **Context-Aware Toilet System (Lid, Sit & Flush)**: High-detail ceramic 3D toilet models across all 4 bathrooms featuring a cistern tank, chrome dual flush button, contoured ceramic bowl, inner well with water disc, seat ring, and fully visible articulated lid cover.
    * **Flush Button Targeting**: Looking at the chrome flush button on top of the cistern displays `[E] Flush Toilet`. Pressing <kbd>E</kbd> triggers swirling water disc rotation, suction dip animation, and realistic procedural rushing water and refill hiss audio. Flushing can also be activated while seated!
    * **Toilet Lid Targeting**: Looking at a closed lid displays `[E] Open Toilet Lid` (swings smoothly open ~104° against cistern with ceramic clack audio); looking at an open lid displays `[E] Close Toilet Lid` (swings down flat to cover bowl).
    * **Toilet Seat Targeting**: Looking at the seat with lid open displays `[E] Sit on Toilet`, allowing the player to sit down in proper seated posture. Looking at the seat with lid closed displays `[E] Open Toilet Lid` first.
* **Interactive Window Curtains & Realistic See-Through Windows**:
  * **Architectural Window Apertures & Crystal-Clear Glazing**:
    * All exterior and courtyard walls feature exact CAD-compliant window apertures with solid sill walls below, lintel walls above, and structural piers flanking each opening.
    * Eliminates solid wall mesh overlap behind windows, providing crystal-clear see-through views from inside rooms out to the garden, street, trees, and sky (and vice versa).
    * Windows are dedicated strictly to habitable rooms and daylight portals (living lounge, bedrooms, and mandir), removing superfluous windows behind the stairs and in the first-floor hallway for an authentic residential facade.
    * Centered 1-inch thin glazed window panes (`M-GLASS`, opacity 0.25, roughness 0.04) with aluminum sashes and frames.
  * **Sensible Curated Curtain Placements**:
    * Drapes placed strictly in primary living and sleeping spaces where privacy and sun shading make architectural sense (Ground Floor Bedroom garden window, Ground Floor Lobby north window, First Floor Master Bedroom west window, First Floor Lounge south windows, and First Floor Child Bedroom north window).
    * Removed unnecessary hallway draperies to ensure smooth, open corridor navigation.
  * **Animated Gathering Kinematics**: Pressing <kbd>E</kbd> or clicking slides both fabric panels smoothly apart to the outer edges ($openRatio \to 1.0$), gathering into folds and exposing over 76% of the window glass to provide clear views of the outdoor gardens and street.
  * **Procedural Fabric Slide Audio**: Web Audio synthesis simulating realistic curtain fabric sliding on brass rings across the metallic curtain rod.
* **Interactive Storage System (Almirahs, Cupboards, Drawers & 3-Tier Chests)**:
  * **3 Interactive Wardrobes / Almirahs**: Built for Master Bedroom (GF), Master Bedroom (1F), and Child Bedroom (1F). Features dual swinging doors (left door swings $-98^\circ$, right door $+98^\circ$ out into the room), flush chrome pull handles with mounting standoffs aligned to the center meeting stiles, upper hat shelf, lower shelf, and stainless steel clothing hanger rail.
  * **South Hallway 3-Tier Almirah (`POR-01`)**: Directly replaces the south hallway placeholder box in front of the main entrance gate with a walnut almirah cabinet (`M-LAMINATE-WALNUT`) featuring 3 interior storage tiers (divided by 2 horizontal shelves). Fitted with a unified double door that opens from the center meeting stiles (left door swings out to the left, right door swings out to the right), vertical brushed chrome pull handles, beveled door panel molding, hollow interior storage, and realistic cabinet hinge creak and magnetic latch audio.
  * **7 Interactive Kitchen Cupboards (Overhead Wall & Under-Platform Base Units)**:
    * **2 Overhead Wall Cupboards**: Wall units in GF Kitchen with swinging cabinet doors, interior shelving, and chrome handles flush to the opening edges.
    * **5 Under-Platform Base Cupboards**: Replacing solid dummy blocks beneath the granite counters with functional double-door cabinets featuring interior storage shelves and ergonomic top-edge handles: GF Under-Sink Double Cupboard, GF Pantry Base Cupboard, GF West Counter Base Cupboard, 1F Under-Sink Double Cupboard, and 1F South Base Cupboard.
  * **6 Interactive Bedside Nightstand Drawers**: Flanking bedside tables in GF Master Bedroom, 1F Master Bedroom, and 1F Child Bedroom. Animated pull-out drawer boxes slide smoothly forward into the room with sleek metallic handles and exposed hollow storage cavities.
  * **3 Multi-Floor Interactive 3-Tier Drawer Chests (Garage & Kitchen Base Units)**:
    * **Kitchen Base 3-Tier Utensil Chests**: Modular 3-tier sliding drawer units built below the platform in GF Kitchen (`Cutlery Drawer`, `Utensil Drawer`, `Pot Drawer`) and 1F Kitchen, sliding North into the room with horizontal brushed steel handles.
    * **Garage Industrial Tool Chest (`GAR-03`)**: Directly replaces the Garage placeholder box with 3 stacked heavy-duty drawers along the west wall crafted in industrial dark charcoal steel with matte aluminum handles, pulling East into the garage.
    * **Independent Kinematic Control**: Each drawer chest tier and cupboard/almirah unit is tracked with its own reticle hitmesh, prompt (`[E] Open ...`, `[E] Close ...`), hollow storage interior, and procedural audio.
  * **Procedural Wood & Slide Audio**: Authentic cabinet wood hinge creak and magnetic catch latch on wardrobe/cupboard/almirah doors, paired with wooden glide runner friction on bedside drawers and tool chests.
* **Interactive Smart Television System (GF & 1F Dedicated Video Folders & 3D Spatial Audio)**:
  * **Interactive 55-inch OLED Displays (`LOB-08` GF, `LB-08` 1F)**: Full interactive TV system in both Ground Floor and First Floor living lobbies. Approach in First-Person mode to see `[E] Turn On ...` / `[E] Turn Off ...` prompts, or click directly on the TV in Orbit / Dollhouse mode.
  * **Dedicated Folders for Each TV**:
    * Ground Floor TV: `public/videos/gf-tv/`
    * First Floor TV: `public/videos/1f-tv/` (also aliased via `public/videos/2f-tv/`)
  * **Standby Screen ("Nothing to play")**:
    * If no `.mp4` video is present in the respective folder, turning on the TV displays a clean 16:9 dark obsidian standby screen with "Nothing to play", displaying the target folder path and instructions. No random videos will ever play.
  * **Automatic Video Detection & Loop Playback**:
    * Exclusively filters and plays `.mp4` video files.
    * If multiple `.mp4` videos are present, automatically detects and plays the latest one (sorted by modification time `mtimeMs`).
    * Seamlessly loops video playback on the TV screen using `THREE.VideoTexture`.
  * **Physical 3D Positional Audio Dynamics**:
    * Integrated Web Audio `THREE.PositionalAudio` streaming from the video element into the 3D room.
    * Directional sound projection cone oriented Westward into the living room seating area.
    * Inverse-distance acoustic roll-off (`refDistance: 5.0 ft`, `maxDistance: 35.0 ft`).
    * Authentic concrete slab floor muffling: volume plays at 100% on the active floor and drops to 12% muffled acoustic bleed when transitioning to the other floor.
* **Interactive Drivable Luxury Sport SUV (India RHD & Open Crystal-Clear Cabin)**:
  * **Rugged Luxury 3D SUV Architecture (G-Class / Defender Design)**:
    * Replaces the former primitive placeholder boxes with a muscular, iconic luxury 4x4 SUV in deep midnight obsidian/sapphire metallic clearcoat paint (`#162238`).
    * **100% Crystal-Clear Open Sightlines (No Glass Occlusion)**: All window panes have been removed, transforming the cabin into clean structural A, B, C, and D pillars with open apertures:
      * **Front Windshield Opening**: Framed by solid A-pillars, cowl bar, and roof header with dual front wipers, providing an unobstructed forward view across the hood and street.
      * **Side Window Apertures**: 3 open window spaces on each side (Front, Rear, Quarter) between structural pillars.
      * **Rear Tailgate Opening**: Open rear tailgate frame with mounted spare tire visible behind.
    * **Indian Right-Hand Drive (RHD) Front Cockpit Ergonomics**:
      * Driver is seated in the **front seat** directly behind the steering wheel and digital instrument cluster on the right-hand side (Indian traffic standard).
      * Passenger seat and grab handle positioned on the left-hand side.
      * Center navigation infotainment screen and floor console with automatic gear shifter located between the front seats.
      * Driver exit teleportation placed directly beside the right-hand driver's door.
      * Rear passenger bench seat positioned comfortably behind the front row.
    * **Bold Exterior Sculpting**: Heavy-duty ladder chassis with chrome tubular side step running boards, muscular box fender flares over all 4 wheels, continuous horizontal waist rub-strip with chrome insert trim, flat hood with central power bulge, and iconic fender-top crystal amber turn indicators.
    * **Front Fascia & Round Projector Halo Lights**: Upright rectangular radiator grille with 3 horizontal chrome slats and center luxury star emblem, dual round LED projector headlights with circular glowing white Halo DRL rings, dynamic forward Three.js `SpotLight` beams, steel bumper with silver skid plate, and front/rear license plates (`KA-01-HG-2026`).
    * **Tailgate with Mounted Hard-Shell Spare Tire**: Full-size rear-mounted spare wheel in a luxury hard-shell cylindrical cover with polished chrome trim ring and center badge emblem, vertical LED taillight clusters, rear bumper bar, and dual polished chrome exhaust pipes.
    * **Roof with Drip Rails & Expedition Rails**: Flat solid roof panel with longitudinal reinforcement ribs and low-profile black/silver expedition roof rack rails.
    * **High-Performance Alloy Wheels & Brakes**: Deep-tread all-terrain rubber tires, machine-finished 5-double-spoke alloy wheels with center hub caps, ventilated disc brake rotors, and vibrant red sports calipers.
  * **Interactive Drivable Mechanics & Controls**:
    * **Enter / Drive (<kbd>E</kbd>)**: Approach the driver's side (right side) in First-Person mode and press <kbd>E</kbd> (`[E] Enter Car`), or left-click the car in Orbit / Dollhouse mode.
    * **Accelerate & Reverse (<kbd>W</kbd> / <kbd>S</kbd> or <kbd>↑</kbd> / <kbd>↓</kbd>)**: Smooth responsive acceleration forward up to 16 mph and reverse braking.
    * **Steer (<kbd>A</kbd> / <kbd>D</kbd> or <kbd>←</kbd> / <kbd>→</kbd>)**: Articulates front wheels and cockpit steering wheel with realistic bicycle turning physics and spring-back auto-centering.
    * **Handbrake (<kbd>Space</kbd>)**: Instant emergency handbrake stopping.
    * **Dual Driving Cameras (<kbd>C</kbd> or <kbd>5</kbd> / <kbd>P</kbd>)**: Toggle instantly between First-Person **Cockpit Driver View** (sitting in front driver seat on the right looking through the open windshield with 360° mouse freelook) and Third-Person **Chase Cam** (cinematic chase view behind and above the car).
    * **Working Headlights (<kbd>L</kbd>)**: Toggles bright forward LED headlights and spotlights on/off.
    * **Automotive Horn (<kbd>H</kbd>)**: Synthesizes authentic musical dual-tone car horn (`440 Hz` + `554 Hz`).
    * **Built-in Garage Door Remote (<kbd>G</kbd>)**: Press <kbd>G</kbd> from inside the car to remotely open or close the motorized overhead garage door `G2`, allowing seamless drive-out from the garage onto the driveway ramp and front street, and parking back in!
    * **Exit / Park (<kbd>E</kbd>)**: Press <kbd>E</kbd> to park the vehicle, stop the engine, and safely step out onto the ground beside the driver's door back into on-foot walking mode.
    * **Procedural Automotive Web Audio**: Dual-oscillator engine rumble (36 Hz idle) with dynamic RPM pitch modulation scaling with vehicle speed, starter crank, door latch thunk, and dual-tone horn.
* **Architectural Furniture, Entertainment & Sanitary Upgrades**:
  * **High-Detail Dining Tables (`LOB-09`, `LB-09`)**: Rich walnut tabletop slabs with beveled perimeter profiles, recessed apron rails, and 4 tapered square legs with polished brass tip ferrules across both Ground Floor and First Floor.
  * **Ergonomic Dining Chairs (`LOB-14`..`LOB-17`, `LB-14`..`LB-19`)**: Standard ergonomic seat height ($1.45$ ft / $17.4$ inches above floor), providing optimal $12.6$ inches clearance below the $30$-inch tabletop. Fitted with tapered legs with brass glides, cross-stretchers, upholstered padded cushions (`#efeae1`), and curved ergonomic backrests with upright stiles and lumbar slats oriented facing toward their respective tables.
  * **Two-Tier Modern Coffee Tables (`LOB-06`, `LB-06`)**: Accurately centered in the living areas between sofas and media consoles, featuring an inset upper glass pane within walnut framing, lower magazine shelf tier, and tapered legs with brass feet.
  * **Ultra-Slim 55-Inch Smart TVs (`LOB-08`, `LB-08`)**: Architectural wall-mounted displays featuring an ultra-slim dark titanium bezel, glossy deep obsidian OLED glass screen, bottom soundbar grille, chrome brand emblem, glowing cyan standby LED, rear tapered electronics chassis, and heavy-duty articulating wall-mount bracket.
  * **Modern TV Media Consoles (`LOB-07`, `LB-07`)**: Elevated Scandinavian credenzas with 4 tapered wooden legs with brass ferrules, overhanging beveled walnut top slab, center open 2-tier AV component cubby with streaming media box, rear cable grommet, and side soft-close drawer bays with horizontal brushed brass pull hardware.
  * **Ergonomic Study Chairs (`BED-05`, `CH-11`)**: Contemporary task chairs featuring a 5-point chrome star base with rolling casters, vertical gas-lift column, sculpted bucket seat cushion, and contoured breathable mesh backrest with rear chrome support spine.
  * **Hollow Sinks with Counter Cutouts**: Replaced solid top lid plates on all kitchen sinks and bathroom basins with open perimeter mounting lips and rear faucet decks, complemented by precision cutouts in kitchen granite countertops (`KIT-02`, `KF-02`) so sink bowls remain completely open and unobstructed.
* **Realistic Appliances & Laundry Modeling**:
  * **Detailed Kitchen Refrigerators (`KIT-11` & `KF-11`)**: Realistic 3D refrigerator models replacing the plain kitchen boxes on both Ground Floor and First Floor. Features brushed stainless steel casing (`M-STEEL-SS`), recessed base plinth with front leveling foot cylinders, separate upper freezer door (~32% height) and lower fridge door (~63% height) separated by a dark magnetic rubber gasket gap, glowing cyan digital LED temperature control panel (`-18°C` / `3°C`), sleek vertical tubular bar handles with mounting standoffs, and chrome brand emblem. Ground floor fridge faces North; first floor fridge faces South.
  * **Front-Loading Washing Machine (`HW-06`)**: High-detail front loader positioned squarely inside the first-floor hallway corner featuring an enamel appliance chassis, top countertop slab, upper control panel with pull-out detergent drawer, rotary cycle knob with cyan indicator pip, glowing digital LED status screen, recessed stainless steel inner drum cavity, circular chrome porthole bezel, smoked dark glass window, side latch handle, and recessed kick-plate emergency drain hatch.
* **Realistic Interior Furniture Collisions & Dynamic Surface Physics**:
  * **63 Comprehensive Physical Furniture Colliders**: Full physical presence for all interior objects across Ground Floor and First Floor:
    * **Tables & Desks**: Dining tables, living coffee tables, TV media consoles, dressing tables, and study desks.
    * **Chairs & Seating**: All dining chairs, study chairs, armchairs, and living sofas.
    * **Cabinets & Storage**: Kitchen base counters, overhead wall cabinets, almirahs/wardrobes, bedside nightstands, storeroom racks, shoe racks, and mandir units.
    * **Sinks & Sanitary**: All 8 kitchen and bathroom washbasins, sink counters, and all 4 flush toilets.
    * **Vehicles**: Full collision volume for vehicles in the garage.
  * **Stepable Surfaces (Stand & Jump on Beds, Tables, Sofas & Counters)**:
    * Jumping onto beds, tables, study desks, chairs, sofas, or kitchen counters dynamically samples their top surface elevation.
    * Players can jump on, land on, walk across, and stand on top of beds without getting pushed or thrown off!
    * Walking off the edge triggers smooth gravity fall back to the room floor.
  * **Anti-Tunneling Continuous Collision Detection (CCD)**:
    * Substepped player movement integration ($dt$ partitioned into discrete substeps $\le 0.20$ ft) combined with full-depth doorway threshold colliders ($0.56$ - $0.70$ ft depth).
    * Completely prevents tunneling through closed doors and gates when sprinting at full velocity.
  * **Dynamic Seating & Sleeping Collision Bypass**:
    * Occupying any bed, sofa, dining chair, or toilet automatically disables that specific item's collider during sitting/sleeping, preventing any physics jitter, and safely restores it upon standing up.
* **Collapsible Sidebar (<kbd>☰</kbd> / <kbd>✕</kbd>)**: Click the toggle tab on the right edge to expand or collapse the control drawer.
* **Floor Level View (Dollhouse Overview)**:
  * **🏢 Both Floors (<kbd>3</kbd>)**: View the full two-storey residential building.
  * **🏠 Ground Floor (<kbd>1</kbd>)**: Isolate Ground Floor architecture, furniture, and lights; intermediate slab is hidden for an open top-down view into GF rooms.
  * **🏢 First Floor (<kbd>2</kbd>)**: Isolate First Floor architecture and fitout with intermediate slab as its floor; roof and terrace parapets are hidden for an open look into 1F rooms.
* **3-Tier Vertical Exploration (GF + 1F + Terrace)**:
  * **Ground Floor** ($Z = 1.50$ ft plinth): Porch, Living room, Kitchen, Dining, Bedroom, Bathrooms, Storeroom, Garage ramp ($Z = 0.0$ to $0.50$ ft).
  * **First Floor** ($Z = 12.00$ ft): Master Bedroom, Kitchen, Lobby, West Gallery, Bathrooms, Child Bedroom, Mandir, and open exterior balcony with 3.5 ft stainless steel railings.
  * **Terrace Level** ($Z = 22.50$ ft): Fully accessible open-air terrace with 3.25 ft perimeter parapet walls and 3-sided stairwell guard enclosure.
  * **Open Central Shaft with Walkable Gratings**: Features heavy-duty stainless steel open-bar gratings on the 1F floor (allowing see-through views down to GF without falling) and 1F ceiling (providing open sightlines up to the terrace and sky).
* **East-Facing Indian Vastu Orientation & Architectural Compass**:
  * **Cardinal Direction Mapping**:
    * **East (Front / Street)**: Main pedestrian gate `G1`, motorized garage door `G2`, East entrance door `D7`, and front roadway.
    * **West (Rear)**: Backyard, kitchen/washroom rear walls, and West Gallery.
    * **North (Right Flank)**: Garage exterior wall, Mandir room, and storeroom.
    * **South (Left Flank)**: Landscaped garden, entrance porch, and master bedroom.
  * **Live Architectural Compass Rose**: Built-in compass rose on the minimap canvas clearly indicating North (right), East (down), South (left), and West (up).
  * **Dynamic HUD Compass Heading**: Live heading angle and cardinal readout displayed in the bottom HUD status bar (e.g. `Facing: E (90°)`).
  * **Vastu-Aligned Mandir Layout**: The 1F Mandir altar, marble platform, and wooden temple unit are placed against the sacred **East wall** (so devotees face East while praying), with the Mandir window relocated to the North wall.
* **Live Minimap (Top-Right)**: Real-time 2D top-down floor plan showing room boundaries, active floor (`GF PLAN` / `1F PLAN`), player position, viewing direction cone, and architectural compass rose.
* **Quick Teleports**: Click any of the room buttons in the sidebar to jump instantly to any zone across Ground Floor, First Floor, or Terrace.
* **Real-time Status Bar (Bottom)**: Displays current room zone, exact X/Y coordinates in feet, floor elevation, and FPS performance counter.
* **Optimized High-Fidelity Rendering**:
  * Dynamic point light pooling (8 active lights smoothly tracked to camera vicinity, keeping fragment loops constant and avoiding Three.js shader recompilation).
  * Soft PCF shadow mapping (2048x2048) and device pixel ratio capping for silky 60 FPS performance.

---

## 📁 Project Structure

```
house/
├── index.html                   # HTML shell, glassmorphism HUD, minimap & sidebar
├── vite.config.js               # Vite development server configuration
├── package.json                 # Dependencies & build scripts
├── run.sh                       # Quick-launch script
├── styles/
│   └── main.css                 # Dark glassmorphic design system & UI animations
└── src/
    ├── main.js                  # Application entry point bootstrapping Engine
    ├── config/
    │   ├── constants.js         # Global WORLD_SCALE multiplier & player physics configuration
    │   └── palette.js           # Full PBR architectural materials palette
    ├── data/
    │   ├── groundFloorData.js   # Ground floor CAD structure (walls, plinth, stairs, slab)
    │   ├── groundFloorFitout.js # Ground floor interior fitout (furniture, doors, windows, fans)
    │   ├── firstFloorData.js    # First floor CAD structure (cantilevers, walls, upper stair, roof, parapet)
    │   ├── firstFloorFitout.js  # First floor interior fitout (furniture, doors, windows, fans, shaft grills)
    │   ├── interiorColliders.js # Interior furniture obstacle collision definitions with walking insets
    │   └── index.js             # Master Floors Registry aggregating floors, colliders, teleports
    ├── core/
    │   ├── Engine.js            # Main loop, time delta, FPS counter, and system orchestration
    │   ├── SceneManager.js      # Three.js scene, camera, WebGL renderer, tone mapping
    │   └── Lighting.js          # Directional sun with soft shadow map & ambient fill
    ├── world/
    │   ├── HouseBuilder.js      # Procedural mesh builder for structural solids and stairs
    │   ├── FitoutBuilder.js     # Mesh builder for doors, windows, gates, animated fans, lights
    │   ├── DoorManager.js       # Interactive doors, pedestrian gates, motorized overhead garage door & audio
    │   ├── SinkManager.js       # Interactive sinks & washbasins with animated water streams & Web Audio
    │   ├── FurnitureManager.js  # Interactive beds, sofas, chairs, toilets with lid & flush mechanics
    │   ├── CurtainManager.js    # Interactive window curtains with fabric gathering drapes & slide audio
    │   ├── StorageManager.js    # Interactive wardrobes (almirahs), cupboards, and nightstand drawers
    │   ├── TVManager.js         # Interactive Smart TVs with dedicated folders, .mp4 loop playback & 3D audio
    │   ├── VehicleManager.js    # Interactive drivable Luxury SUV with audio, lights, horn & garage remote
    │   ├── Materials.js         # Reusable Three.js PBR materials manager
    │   ├── Environment.js       # Extended terrain, street, fog, and sky dome
    │   └── RoomLabels.js        # 3D billboard canvas sprites for room labels
    ├── player/
    │   ├── Player.js            # Physics state, grounded elevation tracking, movement
    │   ├── CollisionSystem.js   # Multi-floor elevation sampling & sliding wall collision
    │   └── InputManager.js      # Keyboard and mouse event dispatching
    ├── camera/
    │   └── CameraController.js  # First-Person PointerLock + Dollhouse OrbitControls
    └── ui/
        └── UIManager.js         # Live HUD, interactive minimap canvas, sidebar, loader
```

---

## 🚀 Running the Project

* **Development Server:**
  ```bash
  npm run dev
  # or ./run.sh
  ```
  Open `http://localhost:3000` in your browser.

* **Production Build:**
  ```bash
  npm run build
  ```
