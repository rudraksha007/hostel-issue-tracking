'use client'
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

// ============================================
// TYPES AND DATA
// ============================================

type UserProfile = {
  id: string;
  name: string;
  email: string;
  phone: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER' | 'PREFER_NOT_TO_SAY';
  userType: 'STUDENT' | 'WARDEN' | 'ADMIN' | 'STAFF';
  isActive: boolean;
  createdAt: string;
  seat?: {
    seatNo: number;
    room: {
      roomNo: number;
      floor: {
        number: number;
        block: {
          name: string;
          building: {
            name: string;
          };
        };
      };
    };
  };
};

type IssueCategory = {
  id: string;
  name: string;
  subCategories: string[];
};

const ISSUE_CATEGORIES: IssueCategory[] = [
  {
    id: 'plumbing',
    name: 'Plumbing',
    subCategories: ['Leaking Tap', 'Blocked Drain', 'Water Tank Issue', 'Toilet Problem', 'Pipeline Damage', 'Other']
  },
  {
    id: 'electrical',
    name: 'Electrical',
    subCategories: ['Fan Not Working', 'Light Issue', 'Socket Problem', 'Switch Damage', 'Wiring Issue', 'Other']
  },
  {
    id: 'cleanliness',
    name: 'Cleanliness',
    subCategories: ['Room Cleaning', 'Bathroom Cleaning', 'Corridor Cleaning', 'Garbage Disposal', 'Pest Control', 'Other']
  },
  {
    id: 'internet',
    name: 'Internet/WiFi',
    subCategories: ['No Connection', 'Slow Speed', 'Frequent Disconnection', 'Router Issue', 'Other']
  },
  {
    id: 'furniture',
    name: 'Furniture',
    subCategories: ['Bed Damage', 'Table/Chair Issue', 'Cupboard Problem', 'Door/Window Issue', 'Lock Problem', 'Other']
  },
  {
    id: 'ac',
    name: 'AC/Cooling',
    subCategories: ['AC Not Working', 'Cooling Issue', 'Gas Leakage', 'Remote Issue', 'Noise Problem', 'Other']
  },
  {
    id: 'other',
    name: 'Other',
    subCategories: ['General Maintenance', 'Safety Concern', 'Noise Complaint', 'Other']
  }
];

const TIME_SLOTS = [
  { id: 'morning-1', label: '8:00 AM - 10:00 AM' },
  { id: 'morning-2', label: '10:00 AM - 12:00 PM' },
  { id: 'afternoon-1', label: '12:00 PM - 2:00 PM' },
  { id: 'afternoon-2', label: '2:00 PM - 4:00 PM' },
  { id: 'evening-1', label: '4:00 PM - 6:00 PM' },
  { id: 'evening-2', label: '6:00 PM - 8:00 PM' }
];

type FormData = {
  category: string;
  subCategory: string;
  hostel: string;
  block: string;
  roomNo: string;
  floorNo: string;
  mobileNumber: string;
  availableDate: string;
  timeSlot: string;
  description: string;
  images: File[];
};

const initialFormData: FormData = {
  category: '',
  subCategory: '',
  hostel: '',
  block: '',
  roomNo: '',
  floorNo: '',
  mobileNumber: '',
  availableDate: '',
  timeSlot: '',
  description: '',
  images: []
};

// ============================================
// MAIN COMPONENT
// ============================================

// Maximum file size: 5MB
const MAX_FILE_SIZE = 5 * 1024 * 1024;

// Mock data for testing (remove when backend is connected)
const USE_MOCK_DATA = true;
const MOCK_USER: UserProfile = {
  id: '1',
  name: 'John Doe',
  email: 'john.doe@example.com',
  phone: '9876543210',
  gender: 'MALE',
  userType: 'STUDENT',
  isActive: true,
  createdAt: new Date().toISOString(),
  seat: {
    seatNo: 1,
    room: {
      roomNo: 101,
      floor: {
        number: 1,
        block: {
          name: 'Block A',
          building: {
            name: 'Boys Hostel 1'
          }
        }
      }
    }
  }
};

const ReportIssueFormPage = () => {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [submitMessage, setSubmitMessage] = useState('');
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  // Fetch user profile on component mount
  useEffect(() => {
    const fetchUserProfile = async () => {
      setLoadingProfile(true);
      try {
        if (USE_MOCK_DATA) {
          // Use mock data for testing
          setUserProfile(MOCK_USER);
          // Auto-fill form with user profile data
          setFormData(prev => ({
            ...prev,
            hostel: MOCK_USER.seat?.room.floor.block.building.name || '',
            block: MOCK_USER.seat?.room.floor.block.name || '',
            floorNo: MOCK_USER.seat?.room.floor.number.toString() || '',
            roomNo: MOCK_USER.seat?.room.roomNo.toString() || ''
          }));
          setLoadingProfile(false);
          return;
        }

        // Fetch from actual API
        const response = await fetch('/api/user/profile', {
          credentials: 'include',
        });
        
        if (response.ok) {
          const data = await response.json();
          setUserProfile(data);
          // Auto-fill form with user profile data
          setFormData(prev => ({
            ...prev,
            hostel: data.seat?.room.floor.block.building.name || '',
            block: data.seat?.room.floor.block.name || '',
            floorNo: data.seat?.room.floor.number.toString() || '',
            roomNo: data.seat?.room.roomNo.toString() || ''
          }));
        } else {
          // If not authenticated, redirect to login
          router.push('/authentication');
        }
      } catch (error) {
        console.error('Failed to fetch user profile:', error);
      } finally {
        setLoadingProfile(false);
      }
    };

    fetchUserProfile();
  }, [router]);

  // Get subcategories based on selected category
  const selectedCategory = ISSUE_CATEGORIES.find(c => c.id === formData.category);
  const subCategories = selectedCategory?.subCategories || [];

  // Get minimum date (today)
  const today = new Date().toISOString().split('T')[0];

  // ============================================
  // FORM HANDLERS
  // ============================================

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleCategoryChange = (categoryId: string) => {
    setFormData(prev => ({ 
      ...prev, 
      category: categoryId, 
      subCategory: '' // Reset subcategory when category changes
    }));
    if (errors.category) {
      setErrors(prev => ({ ...prev, category: undefined }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      
      // Validate file sizes
      const oversizedFiles = filesArray.filter(file => file.size > MAX_FILE_SIZE);
      if (oversizedFiles.length > 0) {
        setErrors(prev => ({
          ...prev,
          images: `Some files exceed the 5MB limit: ${oversizedFiles.map(f => f.name).join(', ')}`
        }));
        return;
      }
      
      // Clear previous image errors
      setErrors(prev => ({ ...prev, images: undefined }));
      
      // Limit to 5 images total
      const remainingSlots = 5 - formData.images.length;
      const filesToAdd = filesArray.slice(0, remainingSlots);
      
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...filesToAdd]
      }));
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};

    if (!formData.category) newErrors.category = 'Please select a category';
    if (!formData.subCategory) newErrors.subCategory = 'Please select a sub-category';
    if (!formData.hostel) newErrors.hostel = 'Hostel information is required';
    if (!formData.block) newErrors.block = 'Block information is required';
    if (!formData.roomNo) newErrors.roomNo = 'Room number is required';
    if (!formData.mobileNumber) {
      newErrors.mobileNumber = 'Please enter your mobile number';
    } else if (!/^[0-9]{10}$/.test(formData.mobileNumber)) {
      newErrors.mobileNumber = 'Please enter a valid 10-digit mobile number';
    }
    if (!formData.availableDate) newErrors.availableDate = 'Please select an available date';
    if (!formData.timeSlot) newErrors.timeSlot = 'Please select a time slot';
    if (!formData.description) {
      newErrors.description = 'Please describe the issue';
    } else if (formData.description.length < 20) {
      newErrors.description = 'Description should be at least 20 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Prevent double submit
    if (submitting) return;
    
    if (!validateForm()) return;

    setSubmitting(true);
    setSubmitStatus('idle');
    setSubmitMessage('');
    
    try {
      const formDataToSend = new FormData();
      
      // Get category and subcategory names
      const categoryName = ISSUE_CATEGORIES.find(c => c.id === formData.category)?.name || '';
      const timeSlotLabel = TIME_SLOTS.find(t => t.id === formData.timeSlot)?.label || '';

      formDataToSend.append('category', categoryName);
      formDataToSend.append('subCategory', formData.subCategory);
      formDataToSend.append('hostel', formData.hostel);
      formDataToSend.append('block', formData.block);
      formDataToSend.append('floorNo', formData.floorNo);
      formDataToSend.append('roomNo', formData.roomNo);
      formDataToSend.append('mobileNumber', formData.mobileNumber);
      formDataToSend.append('availableDate', formData.availableDate);
      formDataToSend.append('timeSlot', timeSlotLabel);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('title', `[${categoryName}] ${formData.subCategory}`);

      // Add images
      formData.images.forEach((image, index) => {
        formDataToSend.append(`image_${index}`, image);
      });

      // TODO: Update endpoint to match your backend
      const response = await fetch('/api/issues', {
        method: 'POST',
        credentials: 'include',
        body: formDataToSend,
      });

      if (response.ok) {
        setSubmitStatus('success');
        setSubmitMessage('Issue reported successfully! Our maintenance team will contact you soon.');
        // Reset form after successful submission but preserve auto-filled values
        setFormData({
          ...initialFormData,
          hostel: userProfile?.seat?.room.floor.block.building.name || '',
          block: userProfile?.seat?.room.floor.block.name || '',
          floorNo: userProfile?.seat?.room.floor.number.toString() || '',
          roomNo: userProfile?.seat?.room.roomNo.toString() || ''
        });
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        // Redirect to dashboard after 2 seconds with refresh flag
        setTimeout(() => {
          router.push('/dashboard/user?refresh=true');
          router.refresh();
        }, 2000);
      } else {
        const error = await response.json();
        setSubmitStatus('error');
        setSubmitMessage(error.message || 'Failed to report issue. Please try again.');
      }
    } catch (error) {
      console.error('Failed to submit issue:', error);
      setSubmitStatus('error');
      setSubmitMessage('Failed to report issue. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    // Reset form but preserve auto-filled values from user profile
    setFormData({
      ...initialFormData,
      hostel: userProfile?.seat?.room.floor.block.building.name || '',
      block: userProfile?.seat?.room.floor.block.name || '',
      floorNo: userProfile?.seat?.room.floor.number.toString() || '',
      roomNo: userProfile?.seat?.room.roomNo.toString() || ''
    });
    setErrors({});
    setSubmitStatus('idle');
    setSubmitMessage('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleCancel = () => {
    router.push('/dashboard/user');
  };

  // ============================================
  // RENDER
  // ============================================

  // Show loading state while fetching user profile
  if (loadingProfile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button 
            onClick={handleCancel}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-4"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Dashboard
          </button>
        </div>

        <div className="bg-white rounded-xl border shadow-sm">
          {/* Card Header */}
          <div className="px-6 pt-6 pb-4">
            <h2 className="text-2xl font-semibold text-blue-500">Report Issue Form</h2>
            <p className="text-gray-500 text-sm mt-1">
              Please fill in all the required details to report your issue
            </p>
          </div>

          {/* Success/Error Notification */}
          {submitStatus !== 'idle' && (
            <div className="px-6 pb-4">
              <div className={`p-4 rounded-lg flex items-start gap-3 ${
                submitStatus === 'success' 
                  ? 'bg-green-50 border border-green-200' 
                  : 'bg-red-50 border border-red-200'
              }`}>
                {submitStatus === 'success' ? (
                  <svg className="w-5 h-5 text-green-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-red-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
                <div className="flex-1">
                  <p className={`font-medium ${submitStatus === 'success' ? 'text-green-800' : 'text-red-800'}`}>
                    {submitStatus === 'success' ? 'Success!' : 'Error'}
                  </p>
                  <p className={`text-sm mt-1 ${submitStatus === 'success' ? 'text-green-700' : 'text-red-700'}`}>
                    {submitMessage}
                  </p>
                  {submitStatus === 'success' && (
                    <p className="text-sm text-green-600 mt-2">
                      Redirecting to dashboard...
                    </p>
                  )}
                </div>
                {submitStatus === 'error' && (
                  <button
                    type="button"
                    onClick={() => { setSubmitStatus('idle'); setSubmitMessage(''); }}
                    className="text-red-600 hover:text-red-800"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Card Content */}
          <div className="px-6 pb-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Category and Sub-Category */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Category */}
                <div className="space-y-2">
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category *</label>
                  <select 
                    id="category"
                    value={formData.category} 
                    onChange={(e) => handleCategoryChange(e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md shadow-xs outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-cyan-800 ${errors.category ? 'border-red-500' : 'border-gray-300'}`}
                  >
                    <option value="">Select category</option>
                    {ISSUE_CATEGORIES.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                  {errors.category && <p className="text-sm text-red-500">{errors.category}</p>}
                </div>

                {/* Sub-Category */}
                <div className="space-y-2">
                  <label htmlFor="subCategory" className="block text-sm font-medium text-gray-700">Sub-Category *</label>
                  <select 
                    id="subCategory"
                    value={formData.subCategory} 
                    onChange={(e) => handleInputChange('subCategory', e.target.value)}
                    disabled={!formData.category}
                    className={`w-full px-3 py-2 border rounded-md shadow-xs outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed text-cyan-800 ${errors.subCategory ? 'border-red-500' : 'border-gray-300'}`}
                  >
                    <option value="">{formData.category ? "Select sub-category" : "Select category first"}</option>
                    {subCategories.map((subCat) => (
                      <option key={subCat} value={subCat}>
                        {subCat}
                      </option>
                    ))}
                  </select>
                  {errors.subCategory && <p className="text-sm text-red-500">{errors.subCategory}</p>}
                </div>
              </div>

              {/* Location Details - Auto-filled from User Profile */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="text-sm font-medium text-blue-800">Location Details</span>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {/* Hostel */}
                  <div className="space-y-1">
                    <label htmlFor="hostel" className="block text-xs font-medium text-gray-600">Hostel</label>
                    <input
                      id="hostel"
                      type="text"
                      value={formData.hostel}
                      readOnly
                      className="w-full px-3 py-2 border border-gray-200 rounded-md bg-white text-cyan-800 font-medium cursor-not-allowed"
                    />
                  </div>

                  {/* Block */}
                  <div className="space-y-1">
                    <label htmlFor="block" className="block text-xs font-medium text-gray-600">Block</label>
                    <input
                      id="block"
                      type="text"
                      value={formData.block}
                      readOnly
                      className="w-full px-3 py-2 border border-gray-200 rounded-md bg-white text-cyan-800 font-medium cursor-not-allowed"
                    />
                  </div>

                  {/* Floor */}
                  <div className="space-y-1">
                    <label htmlFor="floorNo" className="block text-xs font-medium text-gray-600">Floor</label>
                    <input
                      id="floorNo"
                      type="text"
                      value={formData.floorNo}
                      readOnly
                      className="w-full px-3 py-2 border border-gray-200 rounded-md bg-white text-cyan-800 font-medium cursor-not-allowed"
                    />
                  </div>

                  {/* Room Number */}
                  <div className="space-y-1">
                    <label htmlFor="roomNo" className="block text-xs font-medium text-gray-600">Room No.</label>
                    <input
                      id="roomNo"
                      type="text"
                      value={formData.roomNo}
                      readOnly
                      className="w-full px-3 py-2 border border-gray-200 rounded-md bg-white text-cyan-800 font-medium cursor-not-allowed"
                    />
                  </div>
                </div>

                {!userProfile?.seat && !loadingProfile && (
                  <p className="text-sm text-yellow-700 mt-2">
                    ⚠️ No room assigned to your profile. Please contact administration.
                  </p>
                )}
              </div>

              {/* Mobile Number */}
              <div className="space-y-2">
                <label htmlFor="mobileNumber" className="block text-sm font-medium text-gray-700">Mobile Number *</label>
                <input
                  id="mobileNumber"
                  type="tel"
                  placeholder="Enter 10-digit mobile number"
                  value={formData.mobileNumber}
                  onChange={(e) => handleInputChange('mobileNumber', e.target.value.replace(/\D/g, '').slice(0, 10))}
                  className={`w-full px-3 py-2 border rounded-md shadow-xs outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-cyan-800 ${errors.mobileNumber ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.mobileNumber && <p className="text-sm text-red-500">{errors.mobileNumber}</p>}
              </div>

              {/* Available Date and Time Slot */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Available Date */}
                <div className="space-y-2">
                  <label htmlFor="availableDate" className="block text-sm font-medium text-gray-700">Available Date for Visit *</label>
                  <input
                    id="availableDate"
                    type="date"
                    min={today}
                    value={formData.availableDate}
                    onChange={(e) => handleInputChange('availableDate', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md shadow-xs outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-cyan-800 ${errors.availableDate ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors.availableDate && <p className="text-sm text-red-500">{errors.availableDate}</p>}
                </div>

                {/* Time Slot */}
                <div className="space-y-2">
                  <label htmlFor="timeSlot" className="block text-sm font-medium text-gray-700">Preferred Time Slot *</label>
                  <select 
                    id="timeSlot"
                    value={formData.timeSlot} 
                    onChange={(e) => handleInputChange('timeSlot', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md shadow-xs outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-cyan-800 ${errors.timeSlot ? 'border-red-500' : 'border-gray-300'}`}
                  >
                    <option value="">Select time slot</option>
                    {TIME_SLOTS.map((slot) => (
                      <option key={slot.id} value={slot.id}>
                        {slot.label}
                      </option>
                    ))}
                  </select>
                  {errors.timeSlot && <p className="text-sm text-red-500">{errors.timeSlot}</p>}
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">Issue Description *</label>
                <textarea
                  id="description"
                  placeholder="Please describe the issue in detail (minimum 20 characters)..."
                  rows={4}
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md shadow-xs resize-none outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-cyan-800 ${
                    errors.description ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                <div className="flex justify-between">
                  {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
                  <p className="text-sm text-gray-500 ml-auto">{formData.description.length} characters</p>
                </div>
              </div>

              {/* Image Upload */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Upload Images (Optional - Max 5)</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                  <div className="flex flex-wrap gap-4">
                    {/* Image Previews */}
                    {formData.images.map((image, index) => (
                      <div key={index} className="relative w-24 h-24">
                        <img 
                          src={URL.createObjectURL(image)} 
                          alt={`Upload ${index + 1}`} 
                          className="w-full h-full object-cover rounded-lg border"
                        />
                        <button 
                          type="button" 
                          onClick={() => removeImage(index)} 
                          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full text-xs hover:bg-red-600 flex items-center justify-center shadow-md"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                    
                    {/* Upload Button */}
                    {formData.images.length < 5 && (
                      <label className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors">
                        <input 
                          ref={fileInputRef}
                          type="file" 
                          accept="image/*" 
                          onChange={handleFileChange} 
                          className="hidden" 
                          multiple 
                        />
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        <span className="text-xs text-gray-500 mt-1">Add Image</span>
                      </label>
                    )}
                  </div>
                  
                  {formData.images.length === 0 && (
                    <p className="text-sm text-gray-500 text-center mt-2">
                      Click to upload images of the issue (PNG, JPG up to 5MB each)
                    </p>
                  )}
                </div>
                {errors.images && <p className="text-sm text-red-500 mt-2">{errors.images}</p>}
              </div>

              {/* Form Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
                <button 
                  type="button" 
                  onClick={handleReset}
                  disabled={submitting || submitStatus === 'success'}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Reset Form
                </button>
                <div className="flex-1" />
                <button 
                  type="button" 
                  onClick={handleCancel}
                  disabled={submitting}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={submitting || submitStatus === 'success'}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Submitting...
                    </span>
                  ) : (
                    'Save & Submit'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportIssueFormPage;
