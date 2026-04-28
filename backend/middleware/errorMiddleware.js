/**
 * Global Error Translator Middleware
 * Translates technical Prisma error codes (Pxxxx) into plain English messages
 * for better Admin UX.
 */

const errorHandler = (err, req, res, next) => {
  if (process.env.NODE_ENV !== 'production') {
    console.error('❌ Error Handler Captured:', err);
  }
  
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message;

  // MySQL/MariaDB Error Translation
  if (err.errno || err.code) {
    const code = err.code || String(err.errno);
    switch (code) {
      case 'ER_DUP_ENTRY':
      case '1062':
        statusCode = 400;
        message = 'A record with this information already exists (Duplicate entry).';
        break;
      case 'ER_ROW_IS_REFERENCED_2':
      case '1451':
        statusCode = 400;
        message = 'Cannot delete or update this record because it is referenced by other items (e.g., an existing order).';
        break;
      case 'ER_NO_REFERENCED_ROW_2':
      case '1452':
        statusCode = 400;
        message = 'Cannot add or update: a referenced record does not exist.';
        break;
      case 'ECONNREFUSED':
        statusCode = 503;
        message = 'Database connection refused. Please check if your MySQL server is running.';
        break;
      default:
        // Keep original message for other codes
        break;
    }
  }

  res.status(statusCode).json({
    message,
    stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack,
    code: err.code || null
  });
};

module.exports = {
  errorHandler
};
