'use client'
import { useRouter } from "next/navigation";

const ReportIssueConsentPage = () => {
  const router = useRouter();

  const handleAgree = () => {
    router.push('/dashboard/user/report-issue/form');
  };

  const handleCancel = () => {
    router.push('/dashboard/user');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-lg w-full bg-white rounded-xl border shadow-sm">
        {/* Card Header */}
        <div className="text-center px-6 pt-6">
          <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold leading-none">Report an Issue</h2>
          <p className="text-base text-gray-500 mt-2">
            Hostel Issue Reporting System
          </p>
        </div>
        
        {/* Card Content */}
        <div className="px-6 py-6 space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2">Before You Proceed</h3>
            <p className="text-sm text-blue-800 leading-relaxed">
              You are about to report an issue in your hostel. Please ensure that you provide accurate information 
              about the problem you are facing. This will help our maintenance team to address your issue promptly.
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="font-medium text-gray-900">Guidelines:</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <svg className="w-5 h-5 text-green-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Provide accurate category and subcategory of the issue</span>
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-5 h-5 text-green-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Enter correct hostel and room details</span>
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-5 h-5 text-green-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Provide a valid mobile number for contact</span>
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-5 h-5 text-green-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Upload clear images of the problem (if applicable)</span>
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-5 h-5 text-green-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Select a suitable time slot for the maintenance visit</span>
              </li>
            </ul>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-800">
              <strong>Note:</strong> False or misleading reports may result in penalties. 
              Please ensure all information provided is accurate.
            </p>
          </div>
        </div>

        {/* Card Footer */}
        <div className="flex flex-col sm:flex-row gap-3 px-6 pb-6">
          <button 
            className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium"
            onClick={handleCancel}
          >
            Cancel
          </button>
          <button 
            className="w-full sm:flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            onClick={handleAgree}
          >
            I Agree & Proceed
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportIssueConsentPage;
