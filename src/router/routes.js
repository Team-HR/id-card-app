const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "", // Matches "/"
        component: () => import("pages/IndexPage.vue"),
      },
      {
        path: ":id(\\d+)?", // Only matches numeric optional ids like /123
        component: () => import("pages/IndexPage.vue"),
      },
      {
        path: "print",
        component: () => import("pages/PrintPdf.vue"),
      },
      {
        path: "dashboard",
        component: () => import("pages/DashboardPage.vue"),
      },
      {
        path: "test",
        component: () => import("pages/Test.vue"),
      },
      {
        path: "form",
        component: () => import("pages/FormPage.vue"),
      },
    ],
  },

  // Always leave this as last one,
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];


export default routes;
