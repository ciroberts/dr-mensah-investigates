
/* =========================================================
   CASE 001 — PEAR MAP DATA

   Navigation:
   Regional → Neighbourhood → Property → Arrival Interaction Point

   All map coordinates are percentages (0–100).
========================================================= */

export const caseMap = {
  regionalImage: "/cases/001-scandbury/map/regional.webp",
  regionalLabel: "Regional View"
};


/* =========================================================
   GEOGRAPHIC REGIONS

   A region represents a geographic area, not an
   individual location.

   Its polygon is clickable on the regional map,
   even though the polygon is invisible during gameplay.

   Coordinates are provisional and can be adjusted
   using the map's debug mode.
========================================================= */

export const mapRegions = {
  "old-town": {
    id: "old-town",
    name: "Old Town",

    image: "/cases/001-scandbury/map/neighbourhood.webp",

    
polygon: [
  [38, 22],
  [47, 19],
  [58, 20],
  [67, 25],
  [72, 32],
  [73, 40],
  [69, 47],
  [61, 52],
  [52, 50],
  [45, 45],
  [39, 37],
  [36, 29]
]
  }
};


/* =========================================================
   INVESTIGATION LOCATIONS

   discovered:
     Controls whether the location's X and label appear.

   regionId:
     Determines which neighbourhood contains the location.

   propertyImage:
     A location with no property map is reference-only.
     It can appear on maps but cannot be travelled to.

   positions:
     regional      = small X on regional map
     neighbourhood = X on neighbourhood map
     property      = property reference position; arrivalPoints carry actionable entry positions

   Discovery will eventually come from shared case state.
========================================================= */

export const mapLocations = [
  {
    id: "scandbury-mansion",
    name: "Scandbury Mansion",
    subtitle: "Old Town, Aldercombe",

    regionId: "old-town",
    discovered: true,

    propertyImage:
      "/cases/001-scandbury/map/scandbury-mansion/property.webp",

    travelEnabled: true,

    arrivalPoints: [
      {
        id: "main-entrance",
        label: "Main Entrance",
        sceneId: "exterior",
        discovered: true,
        travelAccessible: true,
        position: { x: 53, y: 32 }
      },
      {
        id: "service-entrance",
        label: "Service Entrance",
        sceneId: "service-entrance",
        discovered: false,
        travelAccessible: false,
        position: { x: 67, y: 61 }
      }
    ],

    positions: {
      regional: {
        x: 54,
        y: 32
      },

      neighbourhood: {
        x: 61,
        y: 38
      },

      property: {
        x: 53,
        y: 32
      }
    }
  },

  {
    id: "scandbury-pharmacy",
    name: "Scandbury Pharmacy",
    subtitle: "Rivalte",

    regionId: "town-centre",
    discovered: false,

    // Placeholder until this location's map is authored.
    propertyImage: null,
    travelEnabled: false,

    positions: {
      regional: {
        x: 61,
        y: 64
      }
    }
  },

  {
    id: "st-bartholomews",
    name: "St. Bartholomew's Cemetery",
    subtitle: "North Ridge",

    regionId: "north-ridge",
    discovered: false,

    // Placeholder until this location's map is authored.
    propertyImage: null,
    travelEnabled: false,

    positions: {
      regional: {
        x: 28,
        y: 30
      }
    }
  }
];


/* =========================================================
   LOOKUP HELPERS
========================================================= */

export function getMapRegion(regionId) {
  return mapRegions[regionId] ?? null;
}


export function getMapLocation(locationId) {
  return (
    mapLocations.find(
      (location) => location.id === locationId
    ) ?? null
  );
}


export function getDiscoveredLocations(regionId) {
  return mapLocations.filter(
    (location) =>
      location.discovered &&
      location.regionId === regionId
  );
}


export function canTravelToLocation(location) {
  return Boolean(
    location?.discovered &&
    location?.travelEnabled &&
    location?.propertyImage &&
    location?.positions?.property
  );
}