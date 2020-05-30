with open("spCSS.css","w") as file:
    s = ""
    for i in range(16):
        for j in range(16):
            s += ".q{q}.b{b}{{ color: var(--q{q}b{b}-color); background-color: var(--q{q}b{b}-bg-color); }}\n".format(q=i, b=j)
    print(s)
    file.write(s)