import { type RouteConfig, index, prefix, layout, route } from "@react-router/dev/routes";

export default [
    // Home Page (Unprotected Routes)
    index("routes/home.tsx"),
    // Auth routes (unprotected routes)
    route("/sign-up", 'routes/sign-up.tsx'),
    route("/sign-in", 'routes/sign-in.tsx'),
    // Resource Routes (Protected)
    ...prefix("resource", [
        route("/auth", "routes/resource/resource.auth.ts"),
        route("/generations", "routes/resource/resource.generations.ts"),
    ]),
    // Dashboard Routes (Protected)
    ...prefix("dashboard", [
        layout("routes/dashboard/layout.tsx", [
            index("routes/dashboard/home.tsx"),
            route("/profile", "routes/dashboard/profile.tsx"),
            route("/tools", "routes/dashboard/tools.tsx"),
            route("/tools/:id", 'routes/dashboard/tool.tsx'),
            route("/generations", 'routes/dashboard/generations.tsx'),
            route("/generations/:toolSlug/:generationId", 'routes/dashboard/generation.tsx'),
        ]),
    ]),
] satisfies RouteConfig;
