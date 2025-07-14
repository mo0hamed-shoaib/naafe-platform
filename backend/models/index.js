import User from './User.js';
import Seeker from './Seeker.js';
import Provider from './Provider.js';
import Admin from './Admin.js';
import Category from './Category.js';
import JobRequest from './JobRequest.js';
import Offer from './Offer.js';
import Review from './Review.js';

// Ensure discriminators are registered
// This is important because the discriminator models need to be imported
// to register themselves with the base User model

export {
  User,
  Seeker,
  Provider,
  Admin,
  Category,
  JobRequest,
  Offer,
  Review
};

export default User; 