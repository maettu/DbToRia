#!/usr/bin/env perl
use strict;
use warnings;
use FindBin;
use lib "$FindBin::Bin/../lib";
use lib "$FindBin::Bin/../../thirdparty/lib/perl5";
use lib "$FindBin::Bin/../../thirdparty/lib/perl5/x86_64-linux-thread-multi";
use Mojolicious::Commands;
use DbToRia::MojoApp;

$ENV{MOJO_APP} = DbToRia::MojoApp->new;

# enable debugging
my $mode = $ARGV[1] // '';
if ($mode eq 'source' or $mode eq 'debug'){
    print "***\nturning on source / debug mode\n***\n";
    $ENV{QX_SRC_MODE} = 1;
    $ENV{QX_SRC_PATH} = "$FindBin::Bin/../../frontend";
}

# Start commands
Mojolicious::Commands->start_app('DbToRia::MojoApp');
