#!/usr/bin/env python3
""" LRU Caching """

from base_caching import BaseCaching


class LRUCache(BaseCaching):
    """ class BaseCaching """
    def __init__(self):
        """ Initialize LRU cache """
        super().__init__()
        self.order = []

    def put(self, key, item):
        """ Add an item using  LRU algo """
        if key is not None and item is not None:
            if len(self.cache_data) >= BaseCaching.MAX_ITEMS:
                discarded_key = self.order.pop(0)
                del self.cache_data[discarded_key]
                print("DISCARD: {}".format(discarded_key))
            self.cache_data[key] = item
            self.order.append(key)

    def get(self, key):
        """ Get an item by key """
        if key is not None:
            if key in self.cache_data:
                self.order.remove(key)
                self.order.append(key)
                self.cache_data[key]
        return None
