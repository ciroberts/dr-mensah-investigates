export const INITIAL_LOCATION_ID = "investigator-desk";
export const INITIAL_SCENE_ID = "desk-main";

export const caseScenes = {
  "investigator-desk": {
    id: "investigator-desk",
    name: "Investigator Workstation",
    initialSceneId: "desk-main",
    scenes: {
      "desk-main": {
        id: "desk-main",
        allowsWorldTravel: true,
        image: "/assets/scenes/001-investigator-desk/desk-main.png",
        alt: "Mensah Investigations investigator workstation",
        markers: [
          {
            id: "case-package",
            x: 49,
            y: 59,
            label: "Case Package",
            type: "visible",
            targetSceneId: "case-package",
          },
          {
            id: "office-photo",
            x: 35,
            y: 22,
            label: "Examine Photograph",
            type: "proximity",
            radius: 100,
            targetSceneId: "office-photo",
          },
        ],
      },
      "case-package": {
        id: "case-package",
        allowsWorldTravel: false,
        image: "/assets/scenes/001-investigator-desk/desk-main.png",
        alt: "Close view of the Mensah Investigations case package",
        focus: { x: 49, y: 58, scale: 1.85 },
        markers: [
        ],
      },
      "office-photo": {
        id: "office-photo",
        allowsWorldTravel: false,
        image: "/assets/scenes/001-investigator-desk/desk-main.png",
        alt: "Close view of a framed office photograph",
        focus: { x: 35, y: 22, scale: 2.25 },
        markers: [
        ],
      },
    },
  },
  "scandbury-mansion": {
    id: "scandbury-mansion",
    name: "Scandbury Mansion",
    initialSceneId: "exterior",
    scenes: {
      exterior: {
        id: "exterior",
        imageCoordinates: true,
        allowsWorldTravel: true,
        image: "/assets/scenes/001-scandbury-mansion/exterior-front-closed.webp",
        alt: "Scandbury Mansion viewed from the street beyond its front gates",
        locationTitle: {
          title: "SCANDBURY MANSION",
          subtitle: "Old Town, Aldercombe",
        },
        views: {
          front: {
            id: "front",
            image: "/assets/scenes/001-scandbury-mansion/exterior-front-closed.webp",
            alt: "Scandbury Mansion viewed from the street beyond its front gates",
            look: { left: "left", right: "right" },
            atmosphere: {
              motionPlate: {
                src: "/assets/scenes/001-scandbury-mansion/scandbury-front-motion.mp4",
                opacity: 0.34,
                maskImage: "/assets/scenes/001-scandbury-mansion/front-foliage-mask.svg",
              },
            },
            markers: [
              { id: "scandbury-intercom-front", x: 38.9, y: 61.7, label: "Inspect Intercom", type: "proximity", radius: 160, targetSceneId: "gate-close", transition: { type: "inspect", originX: 38.9, originY: 61.7 } },
            ],
          },
          left: {
            id: "left",
            image: "/assets/scenes/001-scandbury-mansion/exterior-left.webp",
            alt: "The road and western boundary of Scandbury Mansion viewed from the same roadside position",
            look: { right: "front" },
            markers: [],
          },
          right: {
            id: "right",
            image: "/assets/scenes/001-scandbury-mansion/exterior-right.webp",
            alt: "The road and eastern boundary of Scandbury Mansion from the roadside",
            look: { left: "front" },
          },
          "front-open": {
            id: "front-open",
            image: "/assets/scenes/001-scandbury-mansion/exterior-front-open.webp",
            alt: "Scandbury Mansion viewed from the roadside with the front gates open",
            look: { left: "left", right: "right" },
            markers: [
              { id: "scandbury-intercom-open", x: 38.9, y: 61.7, label: "Inspect Intercom", type: "proximity", radius: 160, targetSceneId: "gate-close", transition: { type: "inspect", originX: 38.9, originY: 61.7 } },
            ],
          },
        },
        initialViewId: "front",
        markers: [],
      },

      "inside-gate": {
        id: "inside-gate",
        allowsWorldTravel: true,
        image: "/assets/scenes/001-scandbury-mansion/inside-gate.png",
        alt: "Scandbury Mansion courtyard viewed from just inside the open front gate",
        markers: [
          {
            id: "central-palm-approach",
            x: 50,
            y: 51,
            label: "Central Palm",
            type: "visible",
            targetSceneId: "central-palm",
            transition: { type: "warp", surface: "pavement" },
          },
          {
            id: "return-gate-close-test",
            x: 50,
            y: 91,
            label: "Gate",
            type: "visible",
            targetSceneId: "gate-close",
            transition: { type: "warp", direction: "backward", surface: "pavement" },
          },
        ],
      },
      "central-palm": {
        id: "central-palm",
        allowsWorldTravel: true,
        image: "/assets/scenes/001-scandbury-mansion/central-palm.png",
        alt: "Scandbury Mansion viewed from the central palm roundabout",
        markers: [
          {
            id: "return-inside-gate",
            x: 50,
            y: 91,
            label: "Gate",
            type: "visible",
            targetSceneId: "inside-gate",
            transition: { type: "warp", direction: "backward", surface: "pavement" },
          },
        ],
      },
      "gate-close": {
        id: "gate-close",
        imageCoordinates: true,
        allowsWorldTravel: false,
        image: "/assets/scenes/001-scandbury-mansion/intercom-close.webp",
        alt: "Bronze intercom beneath the lantern on the left entrance post",
        markers: [
          {
            id: "scandbury-intercom",
            x: 49.4,
            y: 63.2,
            label: "Press Call Button",
            type: "proximity",
            radius: 160,
          },

        ],
      },
    },
  },
};

export function getLocation(locationId) {
  return caseScenes[locationId] ?? null;
}

export function getScene(locationId, sceneId) {
  return caseScenes[locationId]?.scenes?.[sceneId] ?? null;
}
