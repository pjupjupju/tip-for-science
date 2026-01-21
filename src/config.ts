// General
export const PRODUCTION_APP_ORIGIN = 'https://tipforscience.org'

// AWS configuration
export const S3_BUCKET_NAME = 'tfsstorage';
export const AWS_REGION = 'eu-central-1';

// Database configurations
export const TABLE_QUESTION = 'Tfs_Question';
export const TABLE_SESSION = 'Tfs_Session';
export const TABLE_USER = 'Tfs_User';
export const USERS_BY_EMAIL_INDEX = 'Tfs_userByEmail';
export const USERS_BY_SLUG_INDEX = 'Tfs_userBySlug';
export const PLAYERS_BY_HIGHSCORE = 'Tfs_userByHighScore';

// Security constants
export const JWT_SECRET = 'd3860b4c-6df7-4fa4-bd34-4de82b437608';

// Statistical and game constants
export const INITIAL_GENERATION_NUMBER = 1;
export const MAX_GENERATION_NUMBER = 10;
export const MAX_PERCENT_TOO_CLOSE_ANSWERS_PER_GEN = 50;
export const PERCENTAGE_CONSIDERED_TOO_CLOSE = 5;
export const QUESTIONNAIRE_BUNDLE_SIZE = 10;

// EMAILS
export const EMAIL_FROM = 'tfsapp@gmail.com';
export const EMAIL_FROM_NAME = "TipForScience.org"