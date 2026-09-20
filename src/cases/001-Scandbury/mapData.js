
/* =========================================================
   CASE 001 — PEAR MAP DATA

   Regional map → Geographic region → Neighbourhood
   → Discovered location → Property map

   Polygon and marker coordinates are percentages (0–100).
========================================================= */

export const caseMap = {
  regionalImage:
    "/cases/001-scandbury/map/regional.webp",

  regionalLabel: "Regional View"
};


/* =========================================================
   GEOGRAPHIC REGIONS

   Each region has its own neighbourhood map.

   The polygon defines its clickable area on the
   REGIONAL map. These shapes are invisible in normal play.

   Coordinates below are provisional. Adjust them using
   the map-debug class while testing.

   Adding another neighbourhood:
   1. Add its WebP image.
   2. Add another region here.
   3. Assign discovered locations to its region ID.
========================================================= */

export const mapRegions = {
  "old-town": {
    id: "old-town",

    name: "Old Town",

    image:
      "/cases/001-scandbury/map/neighbourhood.webp",

    polygon: [
      [40, 23],
      [55, 20],
      [70, 25],
      [75, 36],
      [70, 49],
      [57, 55],
      [43, 46]
    ]
  }
};


/* =========================================================
   INVESTIGATION LOCATIONS

   A location belongs to a geographic region.

   Its marker is only shown when discovered === true.

   The neighbourhood position identifies the location
   on its region's neighbourhood map.

   The property position identifies the location
   on its own property map.

   Later, discovered will come from the shared case state
   rather than being hardcoded here.
========================================================= */

export const mapLocations = [
  {
    id: "scandbury-mansion",

    name: "Scandbury Mansion",

    subtitle: "Old Town",

    regionId: "old-town",

    discovered: true,

    propertyImage:
      "/cases/001-scandbury/map/scandbury-mansion/property.webp",

    positions: {
      neighbourhood: {
        x: 68,
        y: 25
      },

      property: {
        x: 51,
        y: 43
      }
    }
  },

  {
    id: "scandbury-pharmacy",

    name: "Scandbury Pharmacy",

    subtitle: "Rivalte",

    regionId: "town-centre",

    discovered: false,

    propertyImage:
      "/cases/001-scandbury/map/town-centre/scandbury-pharmacy/property.webp",

    positions: {
      neighbourhood: {
        x: 50,
        y: 50
      },

      property: {
        x: 50,
        y: 50
      }
    }
  },

  {
    id: "st-bartholomews",

    name: "St. Bartholomew's Cemetery",

    subtitle: "North Ridge",

    regionId: "north-ridge",

    discovered: false,

    propertyImage:
      "/cases/001-scandbury/map/north-ridge/st-bartholomews/property.webp",

    positions: {
      neighbourhood: {
        x: 50,
        y: 50
      },

      property: {
        x: 50,
        y: 50
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