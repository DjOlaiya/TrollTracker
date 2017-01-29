#!/opt/local/bin/python
#
# Given a post sum a frequency score of n adjacent words (ngrams)
#
import argparse
import collections
import math
import re
import string
import sys
import socket

import normalise
import ngram
import BaseHTTPServer

class MyHandler(BaseHTTPServer.BaseHTTPRequestHandler):
    def do_HEAD(s):
        s.send_response(200)
        s.send_header("Content-type", "text/html")
        s.end_headers()
    def do_GET(s):
        """Respond to a GET request."""
        s.send_response(200)
        s.send_header("Content-type", "text/html")
        s.end_headers()
        # If someone went to "http://something.somewhere.net/foo/bar/",
        # then s.path equals "/foo/bar/".
        post = s.path.replace("%20", " ")
        of_interest, words = normalise.normalise_post(post)
        is_abusive, top_score = ngram.rate(words)
        s.wfile.write(str(is_abusive) + ',' + str(top_score))

if __name__ == '__main__':
    # We are running this module directly, not simply importing it.
    parser = argparse.ArgumentParser(
         description="Ngram frequency score",
         usage=
           "usage: %(prog)s [-v -r -t<int> -g<int>]\n" 
         + "                [--frequency=<float>]\n"
         + "                [--badcorpus=<file>\n"
         + "                [--neutralcorpus=<file>]\n"
         + "                [--pickle] [ --restore]" )

    parser.add_argument("-b", "--badcorpus",
                      action='store',
                      default=sys.stdin,
                      dest='bad_corpus',
                      help="Corpus of abusive posts",
                      type=argparse.FileType('r'),
                      required=True)

    parser.add_argument("-f", "--frequency",
                      action="store",
                      default=0.5,
                      dest="abuse_freq",
                      type=float,
                      required=False,
                      help="Frequency of abuse probability")

    parser.add_argument("-g", "--gramcount",
                      action="store",
                      default=1,	# Unigram
                      type=int,
                      dest="ngram_count",
                      required=False,
                      help="N-gram size to use for classifier 1..5")

    parser.add_argument("-n", "--neutralcorpus",
                      action='store',
                      default=sys.stdin,
                      dest='neutral_corpus',
                      help="Corpus of neutral posts",
                      type=argparse.FileType('r'),
                      required=False)

    parser.add_argument("-p", "--pickle",
                      action='store_true',
                      default=False,
                      dest='pickle',
                      help="Persist of Corpus of neutral posts",
                      required=False)

    parser.add_argument("-r", "--restore",
                      action="store_true",
                      default=False,
                      dest="restore",
                      required=False,
                      help="Restore the pickled neutral posts to save time.")

    parser.add_argument("-t", "--topwords",
                      action="store",
                      default=20,
                      dest="top_words",
                      type=int,
                      required=False,
                      help="Top words to print in verbose mode")

    parser.add_argument("-v", "--verbose",
                      action="count",
                      default=0,
                      dest="verbose",
                      required=False,
                      help="Print status messages to stdout")

    args = parser.parse_args()

    assert ( args.neutral_corpus or args.restore), \
             "Must supply either neutral corpus or a pickled version"

    ngram = ngram.Ngram( "Ngram Classifier", args.bad_corpus, args.neutral_corpus,
                         args.verbose, args.top_words,
                         args.pickle, args.restore, args.ngram_count, args.abuse_freq )


    server_class = BaseHTTPServer.HTTPServer
    httpd = server_class(('localhost', 50007), MyHandler)
    print("Serving")
    httpd.serve_forever()


    s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    s.bind(('localhost', 50007))
    s.listen(1)
    conn, addr = s.accept()
    print('Connected by', addr)
    while True:
      post = conn.recv(1024)
      if post == '': continue
      of_interest, words = normalise.normalise_post( post )
      is_abusive, top_score = ngram.rate(words)
      conn.sendall(str(is_abusive) + ', ' + str(top_score) + '\n')