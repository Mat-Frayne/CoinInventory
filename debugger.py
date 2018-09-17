#!/usr/bin/env python
"""."""
import datetime 
from os import environ
import sys

def debug(*args, **kwargs):
    """Debugs at diffrent levels.

       To change the level, set PyDebug in your environments:
                Windows:  setx PyDebug <number>
    """
    if int(environ.get('PyDebug', 100)) >= kwargs.get("level", 1):
        time = datetime.datetime.now().strftime("[%d %b %Y] [%I:%M:%S %p]")
        print(f"{time} [{kwargs.get('level', 1)}] >> {' '.join(str(x) for x in args)}", file=kwargs.get("file", sys.stdout))

def set_level(level):
    """."""
    environ["PyDebug"] = str(level)

def main():
    """."""
    debug("Working!!!!", "asfsdf", level=1)


if __name__ == '__main__':
    main()
#asdfg