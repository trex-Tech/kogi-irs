import AdminBills from "./pages/AdminBills";
import AdminLogin from "./pages/AdminLogin";
import AdminOverview from "./pages/AdminOverview";
import Choice from "./pages/Choice";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SingleBill from "./pages/SingleBill";
import DemandNotice from "./pages/DemandNotice";
import OperatorsSignup from "./pages/OperatorsSignup";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import OperatorOverview from "./pages/OperatorOverview";
import OperatorsDeclaration from "./pages/OperatorsDeclaration";
import OperatorsInvoice from "./pages/OperatorsInvoice";
import OperatorLogin from "./pages/OperatorLogin";
import SingleInvoice from "./pages/SingleInvoice";
import OperatorProfile from "./pages/OperatorProfile";
import AgentsDeclaration from "./pages/AgentsDeclaration";
import AgentInvoice from "./pages/AgentInvoice";
import AgentsInvoice from "./pages/AgentsInvoice";
import AdminAgentBills from "./pages/AdminAgentBills";
import SingleAgentBill from "./pages/SingleAgentBill";
import Invoices from "./pages/Invoices";
import OperatorsEditDeclaration from "./pages/OperatorsEditDeclaration";

export default function App() {
  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <Router>
        <Routes>
          <Route path="/" element={<Choice />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/operator-login" element={<OperatorLogin />} />
          <Route path="/admin-overview" element={<AdminOverview />} />
          <Route path="/admin-bills" element={<AdminBills />} />
          <Route path="/admin-bills/:id" element={<SingleBill />} />
          <Route
            path="/admin-bills/:id/demand-notice"
            element={<DemandNotice />}
          />

          <Route path="/admin-agent-bills" element={<AdminAgentBills />} />
          <Route path="/admin-agent-bills/:id" element={<SingleAgentBill />} />

          <Route path="/operators-signup" element={<OperatorsSignup />} />
          <Route path="/operators-overview" element={<OperatorOverview />} />
          <Route path="/operators-invoice" element={<OperatorsInvoice />} />
          <Route path="/operators-single-invoice" element={<SingleInvoice />} />
          <Route path="/agents-invoice" element={<AgentsInvoice />} />
          <Route path="/agents-single-invoice" element={<AgentInvoice />} />
          <Route path="/admin-invoices" element={<Invoices />} />

          <Route
            path="/operators-send-declaration"
            element={<OperatorsDeclaration />}
          />

          <Route
            path="/operators-edit-declaration/:id"
            element={<OperatorsEditDeclaration />}
          />

          <Route path="/operator-profile" element={<OperatorProfile />} />
          <Route
            path="/operator-send-agent-declaration"
            element={<AgentsDeclaration />}
          />
        </Routes>
      </Router>
    </>
  );
}
