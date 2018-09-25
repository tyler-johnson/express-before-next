import * as core from "express-serve-static-core";

declare global {
  namespace Express {
    interface Request {
      beforeNext(fn: () => any): void;
    }
  }
}

// mutate core router type to include the handle method
declare module "express-serve-static-core" {
  interface IRouter {
    handle: RequestHandler;
  }
}

export interface Router {
  handle?: core.RequestHandler;
}

export default function attachBeforeNext(router: Router) {
  if (typeof router.handle !== "function") {
    return function restore() {};
  }

  const handle = router.handle;
  router.handle = function beforeNextHandle(req, res, done) {
    const fns: Array<() => any> = [];

    function beforeNext(fn: () => any) {
      fns.push(fn);
    }

    req.beforeNext = beforeNext;

    return handle.call(this, req, res, function(this: any, err: any) {
      try {
        for (const fn of fns) {
          fn.call(req);
        }

        if (req.beforeNext === beforeNext) {
          delete req.beforeNext;
        }

        done.call(this, err);
      } catch(e) {
        done.call(this, err);
      }
    });
  };

  return function restore() {
    router.handle = handle;
  };
}
