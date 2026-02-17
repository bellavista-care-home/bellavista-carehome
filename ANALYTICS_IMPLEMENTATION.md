# Google Analytics 4 Implementation Guide

## Overview
Google Analytics 4 has been successfully implemented in the Bellavista Care Homes website to resolve the `net::ERR_ABORTED` errors and provide comprehensive tracking capabilities.

## What Was Fixed
- **Missing GA4 Implementation**: The website was calling Google Analytics functions but had no actual GA4 code loaded
- **Proper Error Handling**: Added try-catch blocks to prevent analytics failures from breaking the site
- **Privacy-Compliant Configuration**: Implemented GDPR-friendly settings with restricted data processing

## Files Created/Modified

### New Files Created:
1. **`src/utils/analytics.js`** - Core analytics functionality
2. **`src/hooks/useAnalytics.js`** - React hook for automatic page tracking

### Files Modified:
1. **`src/App.jsx`** - Added analytics hook initialization
2. **`src/components/ChatWidget.jsx`** - Added interaction tracking
3. **`src/pages/Contact.jsx`** - Added form submission and contact link tracking
4. **`src/pages/Enquiry.jsx`** - Added enquiry form tracking

## Features Implemented

### 1. Automatic Page View Tracking
- Tracks all page views automatically when routes change
- Includes page path, title, and full URL
- Scroll depth tracking (25%, 50%, 75%, 90%)

### 2. Custom Event Tracking
- **Chat Widget Usage**: Tracks when users open/close the chat widget
- **Chat Option Clicks**: Tracks which quick links users click (care enquiry, schedule tour, call us, FAQ, emergency)
- **Form Submissions**: Tracks successful contact form and enquiry form submissions
- **Contact Interactions**: Tracks phone calls and email clicks

### 3. Privacy & GDPR Compliance
- Restricted data processing enabled
- No ad personalization signals
- Secure cookie configuration (SameSite=None;Secure)
- 2-year cookie expiration

### 4. Error Handling
- Graceful degradation if analytics fails to load
- Console warnings instead of breaking errors
- Fallback behavior for all tracking functions

## Usage Examples

### Basic Page View Tracking (Automatic)
```javascript
// This happens automatically via the useAnalytics hook
// No manual implementation needed
```

### Custom Event Tracking
```javascript
import { event } from '../utils/analytics';

// Track any custom event
event('button_click', {
  button_name: 'schedule_tour',
  page_section: 'hero'
});
```

### Form Submission Tracking
```javascript
import { trackFormSubmission } from '../utils/analytics';

// Track form submissions
trackFormSubmission('Contact Form', {
  formId: 'contact-form',
  category: 'contact',
  location: 'cardiff'
});
```

### Phone/Email Tracking
```javascript
import { trackPhoneCall, trackEmailClick } from '../utils/analytics';

// Track phone calls
trackPhoneCall('Bellavista Cardiff');

// Track email clicks
trackEmailClick('cardiff@bellavistanursinghome.com');
```

## Testing the Implementation

1. **Open Developer Console**: Check for "Google Analytics initialized with measurement ID: G-QX2LK1FZEG"
2. **Navigate Between Pages**: Watch for automatic page view events
3. **Test Chat Widget**: Open/close and click options to see events
4. **Test Contact Forms**: Submit forms to track conversions
5. **Test Contact Links**: Click phone/email links

## Google Analytics Dashboard

Once data starts flowing, you can view:
- **Real-time**: Live user activity
- **Engagement**: Page views, events, conversions
- **Conversions**: Form submissions and contact interactions
- **User Behavior**: Scroll depth and chat widget usage

## Troubleshooting

### Common Issues:
1. **No data appearing**: Check console for "Google Analytics script loaded successfully"
2. **Events not firing**: Verify measurement ID is correct
3. **Privacy errors**: Ensure cookies are enabled in browser

### Browser Console Messages:
- ✅ "Google Analytics script loaded successfully" - Script loaded
- ✅ "Google Analytics initialized with measurement ID: G-QX2LK1FZEG" - GA4 ready
- ⚠️ "Google Analytics script failed to load" - Network/blocker issue
- ⚠️ "Failed to send event to Google Analytics" - Event tracking error

## Next Steps

1. **Verify in Google Analytics**: Check Real-time reports to confirm data flow
2. **Set up Goals**: Create conversion goals for form submissions
3. **Configure Audiences**: Set up remarketing audiences
4. **Add More Events**: Track additional user interactions as needed
5. **Monitor Performance**: Regular review of analytics data

The implementation is now complete and should resolve the previous `net::ERR_ABORTED` errors while providing comprehensive tracking for your care home website.