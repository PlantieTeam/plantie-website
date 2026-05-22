import { FC } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import HomePage from "./pages/home";
import AssistantPage from "./pages/assistant";

import MainLayout from "./layouts/MainLayout";

const Router: FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="/app" element={<HomePage />} />
          <Route path="/assistant" element={<AssistantPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default Router;