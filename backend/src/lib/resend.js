'use strict';
const { Resend } = require('resend');

const resend   = new Resend(process.env.RESEND_API_KEY || 'sandbox');
const fromEmail = process.env.RESEND_FROM_EMAIL || 'segreteria@muliastracchi.it';

module.exports = { resend, fromEmail };
