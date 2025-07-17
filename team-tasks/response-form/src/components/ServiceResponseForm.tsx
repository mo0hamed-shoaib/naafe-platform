import React, { useState } from 'react';
import { X, Check, Star, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface FormData {
  price: string;
  timeline: string;
  duration: string;
  message: string;
  availableDates: number[];
  timePreferences: string[];
  agreedToTerms: boolean;
}

const ServiceResponseForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    price: '',
    timeline: '',
    duration: '',
    message: '',
    availableDates: [2, 8, 14],
    timePreferences: [],
    agreedToTerms: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleDateClick = (date: number) => {
    if (date === 9) return; // Disabled date
    
    setFormData(prev => ({
      ...prev,
      availableDates: prev.availableDates.includes(date)
        ? prev.availableDates.filter(d => d !== date)
        : [...prev.availableDates, date]
    }));
  };

  const handleTimePreferenceChange = (preference: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      timePreferences: checked
        ? [...prev.timePreferences, preference]
        : prev.timePreferences.filter(p => p !== preference)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    console.log('Form submitted:', formData);
  };

  const getDayClass = (date: number) => {
    if (date === 9) return 'bg-gray-300 text-gray-500 cursor-not-allowed';
    if (formData.availableDates.includes(date)) {
      if (date === 2 || date === 14) return 'bg-emerald-200 text-emerald-800';
      if (date === 8) return 'bg-orange-200 text-orange-800';
    }
    return 'hover:bg-gray-200';
  };

  const formatPrice = (price: string) => {
    return price ? `$${price}` : '$0';
  };

  const getTimelineDisplay = () => {
    switch (formData.timeline) {
      case 'today': return 'Today';
      case 'tomorrow': return 'Tomorrow';
      case 'this-week': return 'This week';
      case 'next-week': return 'Next week';
      case 'flexible': return 'Flexible';
      default: return 'Not specified';
    }
  };

  return (
    <div className="min-h-screen bg-[#F5E6D3] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl flex overflow-hidden">
        {/* Form Section */}
        <div className="w-full lg:w-1/2 p-8">
          <header className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-[#2D5D4F] mb-1">
                Respond to Service Request
              </h1>
              <p className="text-sm text-[#50958A]">
                for "Professional Headshot Photography"
              </p>
            </div>
            <Button variant="ghost" size="icon" className="text-gray-400 hover:text-gray-600">
              <X className="h-5 w-5" />
            </Button>
          </header>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Your Offer Section */}
            <div>
              <h2 className="text-lg font-semibold text-[#2D5D4F] mb-4 pb-2 border-b border-gray-200">
                Your Offer
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="price" className="text-sm font-medium text-[#0E1B18] mb-2 block">
                    Your Price
                  </Label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                      $
                    </span>
                    <Input
                      id="price"
                      type="number"
                      placeholder="Enter your price"
                      value={formData.price}
                      onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                      className="pl-7 h-12 focus:ring-2 focus:ring-[#2D5D4F] focus:border-[#2D5D4F]"
                    />
                  </div>
                  <p className="mt-2 text-sm text-emerald-600 flex items-center">
                    <Check className="h-4 w-4 mr-1" />
                    Fair market price
                  </p>
                </div>
                
                <div>
                  <Label htmlFor="timeline" className="text-sm font-medium text-[#0E1B18] mb-2 block">
                    When can you start?
                  </Label>
                  <Select value={formData.timeline} onValueChange={(value) => setFormData(prev => ({ ...prev, timeline: value }))}>
                    <SelectTrigger className="h-12 focus:ring-2 focus:ring-[#2D5D4F] focus:border-[#2D5D4F]">
                      <SelectValue placeholder="Select timeline" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="today">Today</SelectItem>
                      <SelectItem value="tomorrow">Tomorrow</SelectItem>
                      <SelectItem value="this-week">This week</SelectItem>
                      <SelectItem value="next-week">Next week</SelectItem>
                      <SelectItem value="flexible">Flexible</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="mt-6">
                <Label htmlFor="duration" className="text-sm font-medium text-[#0E1B18] mb-2 block">
                  Estimated Duration
                </Label>
                <Input
                  id="duration"
                  placeholder="e.g., 2 hours"
                  value={formData.duration}
                  onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                  className="h-12 focus:ring-2 focus:ring-[#2D5D4F] focus:border-[#2D5D4F]"
                />
              </div>
            </div>

            {/* Availability Section */}
            <div>
              <h2 className="text-lg font-semibold text-[#2D5D4F] mb-4 pb-2 border-b border-gray-200">
                Availability
              </h2>
              <p className="text-sm text-[#50958A] mb-4">
                Click to select available time slots.
              </p>
              
              {/* Calendar */}
              <div className="grid grid-cols-7 gap-1 text-center text-sm mb-4">
                {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                  <span key={day} className="font-semibold text-[#50958A] p-2">{day}</span>
                ))}
                
                {/* Calendar days */}
                {[28, 29, 30].map(date => (
                  <span key={date} className="text-gray-400 p-2">{date}</span>
                ))}
                
                {Array.from({ length: 31 }, (_, i) => i + 1).map(date => (
                  <button
                    key={date}
                    type="button"
                    onClick={() => handleDateClick(date)}
                    disabled={date === 9}
                    className={cn(
                      'p-2 rounded-full text-sm font-medium transition-all duration-200',
                      getDayClass(date)
                    )}
                  >
                    {date}
                  </button>
                ))}
                
                <span className="text-gray-400 p-2">1</span>
              </div>

              {/* Time Preferences */}
              <div className="space-y-3">
                {[
                  { id: 'mornings', label: 'Mornings' },
                  { id: 'afternoons', label: 'Afternoons' },
                  { id: 'flexible', label: "I'm flexible with timing" }
                ].map(option => (
                  <div key={option.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={option.id}
                      checked={formData.timePreferences.includes(option.id)}
                      onCheckedChange={(checked) => 
                        handleTimePreferenceChange(option.id, checked as boolean)
                      }
                      className="data-[state=checked]:bg-[#2D5D4F] data-[state=checked]:border-[#2D5D4F]"
                    />
                    <Label htmlFor={option.id} className="text-sm text-[#0E1B18]">
                      {option.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Message Section */}
            <div>
              <h2 className="text-lg font-semibold text-[#2D5D4F] mb-4 pb-2 border-b border-gray-200">
                Your Message
              </h2>
              <div>
                <Label htmlFor="message" className="text-sm font-medium text-[#0E1B18] mb-2 block">
                  Personal Message{' '}
                  <span className="text-[#50958A] font-normal">(optional)</span>
                </Label>
                <Textarea
                  id="message"
                  placeholder="Tell them why you're the right person for this job..."
                  value={formData.message}
                  onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                  maxLength={300}
                  rows={4}
                  className="resize-none focus:ring-2 focus:ring-[#2D5D4F] focus:border-[#2D5D4F]"
                />
                <p className="mt-1 text-xs text-[#50958A] text-right">
                  {formData.message.length} / 300 characters
                </p>
              </div>
            </div>

            {/* Submit Section */}
            <div className="pt-6 border-t border-gray-200">
              <Button
                type="submit"
                disabled={isSubmitting || !formData.agreedToTerms}
                className="w-full bg-[#F5A623] hover:bg-[#e8941f] text-white font-bold h-14 rounded-lg transition-colors duration-300 disabled:bg-gray-300"
              >
                {isSubmitting ? 'Sending...' : 'Send My Response'}
              </Button>
              
              <div className="mt-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="terms"
                    checked={formData.agreedToTerms}
                    onCheckedChange={(checked) => 
                      setFormData(prev => ({ ...prev, agreedToTerms: checked as boolean }))
                    }
                    className="data-[state=checked]:bg-[#2D5D4F] data-[state=checked]:border-[#2D5D4F]"
                  />
                  <Label htmlFor="terms" className="text-sm text-[#0E1B18]">
                    I can complete this service as described
                  </Label>
                </div>
              </div>
              
              <p className="text-xs text-center text-[#50958A] mt-4">
                By submitting, you agree to the{' '}
                <a href="#" className="underline hover:text-[#2D5D4F] transition-colors">
                  Service Provider Terms
                </a>{' '}
                and{' '}
                <a href="#" className="underline hover:text-[#2D5D4F] transition-colors">
                  Money-back Guarantee
                </a>
                .
              </p>
            </div>
          </form>
        </div>

        {/* Live Preview Section */}
        <div className="w-1/2 bg-[#FDF8F0] p-8 hidden lg:block">
          <h2 className="text-lg font-semibold text-[#2D5D4F] mb-6">Live Preview</h2>
          
          <Card className="bg-white shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&crop=face&auto=format"
                  alt="Provider photo"
                  className="h-16 w-16 rounded-full object-cover"
                />
                <div className="ml-4">
                  <h3 className="font-bold text-[#0E1B18]">Your Name</h3>
                  <div className="flex items-center mt-1">
                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    <span className="text-sm text-[#50958A] ml-1">4.9 (123 reviews)</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-semibold text-[#50958A]">Quote</p>
                  <p className="text-2xl font-bold text-[#2D5D4F]">
                    {formatPrice(formData.price)}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm font-semibold text-[#50958A]">Start Date</p>
                  <p className="text-[#0E1B18]">{getTimelineDisplay()}</p>
                </div>
                
                <div>
                  <p className="text-sm font-semibold text-[#50958A]">Message Snippet</p>
                  <p className="text-[#0E1B18] text-sm italic line-clamp-3">
                    {formData.message || "Tell them why you're the right person for this job..."}
                  </p>
                </div>
                
                <div className="pt-4 border-t border-gray-200">
                  <p className="text-sm font-semibold text-[#50958A] mb-2">
                    Skills & Verification
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Badge className="bg-teal-100 text-[#2D5D4F] hover:bg-teal-200">
                      <Shield className="h-3 w-3 mr-1" />
                      Verified
                    </Badge>
                    <Badge variant="secondary" className="bg-gray-200 text-[#0E1B18] hover:bg-gray-300">
                      Photography
                    </Badge>
                    <Badge variant="secondary" className="bg-gray-200 text-[#0E1B18] hover:bg-gray-300">
                      Editing
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tips Section */}
          <Card className="mt-6 bg-teal-50 border-l-4 border-[#2D5D4F]">
            <CardContent className="p-4">
              <p className="font-bold text-[#2D5D4F] mb-2">Tip for a better response</p>
              <ul className="list-disc list-inside text-sm text-[#2D5D4F] space-y-1">
                <li>Add a personal message</li>
                <li>Mention your experience with headshots</li>
                <li>Upload examples of your work</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ServiceResponseForm;