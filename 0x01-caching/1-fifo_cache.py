#!/usr/bin/env python3
""" FIFO caching """

from base_caching import BaseCaching


class FIFOCache(BaseCaching):
    """ FIFOCache class """
    def __init__(self):
        """ initialize FIFO cache """
        super().__init__()

    def put(self, key, item):
        """ Add item using FIFO algo """
        if key is not None and item is not None:
            if len(self.cache_data) >= BaseCaching.MAX_ITEMS:
                discarded_key = next(iter(self.cache_data))
                del self.cache_data[discarded_key]
                print("DISCARD: {}".format(discarded_key))
            self.cache_data[key] = item

    def get(self, key):
        """ Get an item by key """
        if key is not None:
            return self.cache_data.get(key)
