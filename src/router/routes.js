const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      { path: "", component: () => import("pages/IndexPage.vue") },
      { path: "print", component: () => import("pages/PrintPdf.vue") },
      { path: "dashboard", component: () => import("pages/DashboardPage.vue") },
      { path: "test", component: () => import("pages/Test.vue") },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
