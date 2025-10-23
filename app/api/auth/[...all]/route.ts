// import { auth } from '@/lib/auth'; // path to your auth file
// import arcjet, { protectSignup } from '@arcjet/next';
// import { toNextJsHandler } from 'better-auth/next-js';
// import { NextRequest, NextResponse } from 'next/server';

// const aj = arcjet({
//   key: process.env.ARCJET_KEY!, // Get your site key from https://app.arcjet.com
//   rules: [
//     protectSignup({
//       email: {
//         mode: 'LIVE', // will block requests. Use "DRY_RUN" to log only
//         // Block emails that are disposable, invalid, or have no MX records
//         block: ['DISPOSABLE', 'INVALID', 'NO_MX_RECORDS'],
//       },
//       bots: {
//         mode: 'LIVE',
//         // configured with a list of bots to allow from
//         // https://arcjet.com/bot-list
//         allow: [], // "allow none" will block all detected bots
//       },
//       // It would be unusual for a form to be submitted more than 5 times in 10
//       // minutes from the same IP address
//       rateLimit: {
//         // uses a sliding window rate limit
//         mode: 'LIVE',
//         interval: '10m', // counts requests over a 10 minute sliding window
//         max: 5, // allows 5 submissions within the window
//       },
//     }),
//   ],
// });

// const betterHauthHandlers = toNextJsHandler(auth.handler);

// const ajProtectedPOST = async (req: NextRequest) => {
//   const { email } = await req.clone().json();

//   const decision = await aj.protect(req, { email });
//   console.log(decision.isDenied());
//   if (decision.isDenied()) {
//     if (decision.reason.isEmail()) {
//       let message = '';
//       if (decision.reason.emailTypes.includes('INVALID')) {
//         message = 'email address format is invalid. Is there a typo?';
//       } else if (decision.reason.emailTypes.includes('DISPOSABLE')) {
//         message = 'we do not allow disposable email addresses.';
//       } else if (decision.reason.emailTypes.includes('NO_MX_RECORDS')) {
//         message = 'your email domain does not have an MX record. Is there a typo?';
//       } else {
//         message = 'invalid email.';
//       }

//       return NextResponse.json(
//         {
//           message,
//           reason: decision.reason,
//         },
//         { status: 400 }
//       );
//     } else {
//       return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
//     }
//   } else {
//     return betterHauthHandlers.POST(req);
//   }
// };

// export { ajProtectedPOST as POST };
// export const { GET } = toNextJsHandler(auth);

import { auth } from '@/lib/auth';
import arcjet, { protectSignup } from '@arcjet/next';
import { toNextJsHandler } from 'better-auth/next-js';
import { NextRequest, NextResponse } from 'next/server';

// Only initialize Arcjet if the key is available
const aj = process.env.ARCJET_KEY
  ? arcjet({
      key: process.env.ARCJET_KEY,
      rules: [
        protectSignup({
          email: {
            mode: 'LIVE',
            block: ['DISPOSABLE', 'INVALID', 'NO_MX_RECORDS'],
          },
          bots: {
            mode: 'LIVE',
            allow: [],
          },
          rateLimit: {
            mode: 'LIVE',
            interval: '10m',
            max: 5,
          },
        }),
      ],
    })
  : null;

const betterAuthHandlers = toNextJsHandler(auth.handler);

export const POST = async (req: NextRequest) => {
  try {
    const url = new URL(req.url);
    const pathname = url.pathname;

    // Only apply Arcjet protection for sign-up, not sign-in, and only if Arcjet is configured
    if (aj && (pathname.includes('/sign-up') || pathname.includes('/signup'))) {
      const { email } = await req.clone().json();

      const decision = await aj.protect(req, { email });

      if (decision.isDenied()) {
        if (decision.reason.isEmail()) {
          let message = '';

          if (decision.reason.emailTypes.includes('INVALID')) {
            message = 'Email format is invalid. Please check for typos.';
          } else if (decision.reason.emailTypes.includes('DISPOSABLE')) {
            message = 'Disposable email addresses are not allowed.';
          } else if (decision.reason.emailTypes.includes('NO_MX_RECORDS')) {
            message = 'Email domain does not have an MX record.';
          } else {
            message = 'Invalid email.';
          }

          return NextResponse.json({ error: { message } }, { status: 400 });
        }

        return NextResponse.json({ error: { message: 'Forbidden request.' } }, { status: 403 });
      }
    }

    // Continue to Better Auth handler for all requests
    return betterAuthHandlers.POST(req);
  } catch (err) {
    console.error('Auth error:', err);
    return NextResponse.json({ error: { message: 'Internal Server Error' } }, { status: 500 });
  }
};

export const { GET } = toNextJsHandler(auth);
